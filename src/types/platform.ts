import type { Options } from './command'

export interface ProcessResult {
  title: string
  filename: string
}

export interface PlatformProcessor {
  process: (options: Options) => Promise<ProcessResult>
}
