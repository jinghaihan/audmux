import type { ParsedVideoPage, PlayInfoData, PlayInfoResponse, VideoType } from './types'
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { ofetch } from 'ofetch'
import { resolve } from 'pathe'
import { MIXIN_KEY_ENC_TAB, USER_AGENT, VIDEO_TYPE } from './constants'

export function getVideoType(url: string): VideoType | null {
  for (const key in VIDEO_TYPE) {
    if (url.includes(key))
      return VIDEO_TYPE[key as keyof typeof VIDEO_TYPE]
  }
  return null
}

export async function getHTML(url: string): Promise<string> {
  const response = await ofetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
    },
  })
  return response
}

function getMixinKey(imgKey: string, subKey: string) {
  return MIXIN_KEY_ENC_TAB
    .map(index => `${imgKey}${subKey}`[index])
    .join('')
    .slice(0, 32)
}

function buildWbiQuery(params: Record<string, string | number>, imgKey: string, subKey: string) {
  const chrFilter = /[!'()*]/g
  const entries = Object.entries({
    ...params,
    wts: Math.floor(Date.now() / 1000),
  })
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => [key, String(value).replace(chrFilter, '')] as [string, string])
  const query = new URLSearchParams(entries)

  const mixinKey = getMixinKey(imgKey, subKey)
  const wRid = createHash('md5').update(query.toString() + mixinKey).digest('hex')
  query.set('w_rid', wRid)
  return query.toString()
}

export async function getPlayInfo(video: ParsedVideoPage): Promise<PlayInfoData> {
  const query = buildWbiQuery({
    avid: video.aid,
    bvid: video.bvid,
    cid: video.cid,
    qn: 0,
    fnver: 0,
    fnval: 4048,
    fourk: 1,
  }, video.wbiImgKey, video.wbiSubKey)

  const response = await ofetch<PlayInfoResponse>(`https://api.bilibili.com/x/player/wbi/playurl?${query}`, {
    headers: {
      'User-Agent': USER_AGENT,
      'Referer': 'https://www.bilibili.com/',
    },
  })

  if (response.code !== 0 || !response.data?.dash?.audio?.length)
    throw new Error(response.message || 'failed to fetch bilibili play info')

  return response.data
}

export async function downloadAudio(name: string, url: string) {
  const response = await ofetch(url, {
    responseType: 'arrayBuffer',
    headers: {
      'User-Agent': USER_AGENT,
      'Referer': 'https://www.bilibili.com/',
    },
  })
  const filename = `${name}.m4a`
  const filepath = resolve(filename)
  if (existsSync(filepath)) {
    const result = await p.confirm({
      message: `${filename} already exists, overwrite?`,
      initialValue: false,
    })
    if (!result || p.isCancel(result)) {
      p.outro(c.red('aborting'))
      process.exit(1)
    }
  }

  await writeFile(filepath, Buffer.from(response))
  return filename
}
