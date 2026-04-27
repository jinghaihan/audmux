import type { TaskOptions } from './command'

export interface ProcessResult {
  title: string
  filename: string
}

export interface PlatformProcessor {
  process: (options: TaskOptions) => Promise<ProcessResult>
}
