import type { Options, PlatformProcessor, ProcessResult } from '../types'
import { downloadAudio, getHTML, getVideoType } from './api'
import { parseHTML } from './parser'

export class Processor implements PlatformProcessor {
  async process(options: Options): Promise<ProcessResult> {
    const videoType = getVideoType(options.url)
    if (!videoType)
      throw new Error('invalid bilibili url')
    if (videoType !== 'BV')
      throw new Error('only BV videos are supported')

    const html = await getHTML(options.url)
    const data = parseHTML(options.url, html)
    const filename = await downloadAudio(data.title, data.audio.base_url)

    return {
      title: data.title,
      filename,
    }
  }
}
