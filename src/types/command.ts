export type Platform = 'bilibili'

export interface CommandOptions {
  cwd?: string
  url?: string
  bv?: string
}

export interface Options extends CommandOptions {
  platform: Platform
  url: string
}
