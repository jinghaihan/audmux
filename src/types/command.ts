export type Platform = 'bilibili'

export interface CommandOptions {
  cwd?: string
  url?: string | string[]
  bv?: string | string[]
  limit?: number
  retries?: number
}

export interface Options {
  cwd?: string
  platform: Platform
  url: string[]
  limit: number
  retries: number
}

export interface TaskOptions extends Omit<Options, 'url'> {
  url: string
}
