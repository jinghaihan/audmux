import type { CommandOptions, Options } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { BILIBILI_VIDEO_URL_PREFIX, DEFAULT_OPTIONS } from './constants'
import { detectPlatform } from './utils'

export function resolveConfig(options: Partial<CommandOptions>): Options {
  const defaults = structuredClone(DEFAULT_OPTIONS)
  const merged = { ...defaults, ...options }
  const url = resolveURL(merged)

  if (!url) {
    p.outro(merged.bv ? c.red('invalid bilibili bv') : c.red('no url or bv provided'))
    process.exit(1)
  }

  const platform = detectPlatform(url)
  if (platform === 'unknown') {
    p.outro(`${c.red`unsupported platform`}`)
    process.exit(1)
  }

  return {
    ...merged,
    platform,
    url,
  }
}

function resolveURL(options: Partial<CommandOptions>) {
  if (options.url)
    return options.url
  if (options.bv)
    return `${BILIBILI_VIDEO_URL_PREFIX}BV${options.bv.trim().slice(2)}`
  return undefined
}
