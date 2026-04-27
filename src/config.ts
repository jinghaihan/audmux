import type { CommandOptions, Options, Platform } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { BILIBILI_VIDEO_URL_PREFIX, DEFAULT_OPTIONS } from './constants'
import { detectPlatform, toArray } from './utils'

export function resolveConfig(options: Partial<CommandOptions>): Options {
  const defaults = structuredClone(DEFAULT_OPTIONS)

  const merged = { ...defaults, ...options }

  const limit = merged.limit ?? DEFAULT_OPTIONS.limit!
  const retries = merged.retries ?? DEFAULT_OPTIONS.retries!
  const url = resolveURLs(merged)

  if (!url.length) {
    p.outro(c.red('no url or bv provided'))
    process.exit(1)
  }

  const platform = resolvePlatform(url)
  if (!platform) {
    p.outro(`${c.red`unsupported platform`}`)
    process.exit(1)
  }

  return {
    platform,
    url,
    limit,
    retries,
    cwd: merged.cwd,
  }
}

function resolveURLs(options: Partial<CommandOptions>) {
  return [
    ...toArray(options.url),
    ...toArray(options.bv).map(i => `${BILIBILI_VIDEO_URL_PREFIX}${i}`),
  ]
}

function resolvePlatform(urls: string[]): Platform | undefined {
  const platforms = urls.map(detectPlatform)
  const platform = platforms[0]

  if (!platform || platform === 'unknown')
    return undefined
  if (platforms.some(candidate => candidate !== platform))
    return undefined

  return platform
}
