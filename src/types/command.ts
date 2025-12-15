export type Platform = 'bilibili'

export interface CommandOptions {
  cwd?: string
  url?: string
}

export interface Options extends Required<CommandOptions> {
  platform: Platform
}
