import type { VideoType } from './types'
import { Buffer } from 'node:buffer'
import { writeFile } from 'node:fs/promises'
import { ofetch } from 'ofetch'
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
  await writeFile(filename, Buffer.from(response))
  return filename
}
