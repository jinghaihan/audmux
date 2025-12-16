import type { VideoType } from './types'
import { Buffer } from 'node:buffer'
import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { ofetch } from 'ofetch'
import { resolve } from 'pathe'
import { USER_AGENT } from '../constants'
import { VIDEO_TYPE } from './constants'

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
