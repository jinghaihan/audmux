import type { CommandOptions, Options } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { DEFAULT_OPTIONS } from './constants'
import { detectPlatform } from './utils'

export function resolveConfig(options: Partial<CommandOptions>): Options {
  const defaults = structuredClone(DEFAULT_OPTIONS)
  const merged = { ...defaults, ...options }

  if (!merged.url) {
    p.outro(`${c.red`no url provided`}`)
    process.exit(1)
  }

  const platform = detectPlatform(merged.url)
  if (platform === 'unknown') {
    p.outro(`${c.red`unsupported platform`}`)
    process.exit(1)
  }

  return {
    ...merged,
    platform,
  } as Options
}
