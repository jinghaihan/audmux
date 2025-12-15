import type { Platform, PlatformProcessor } from './types'
import { Processor } from './bilibili'

const processors: Record<Platform, PlatformProcessor> = {
  bilibili: new Processor(),
}

export function getPlatformProcessor(platform: Platform): PlatformProcessor {
  return processors[platform]
}
