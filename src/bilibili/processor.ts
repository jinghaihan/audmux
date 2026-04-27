import type { PlatformProcessor, ProcessResult, TaskOptions } from '../types'
import { downloadAudio, getHTML, getPlayInfo, getVideoType } from './api'
import { parseHTML } from './parser'

export class Processor implements PlatformProcessor {
  async process(options: TaskOptions): Promise<ProcessResult> {
    const videoType = getVideoType(options.url)
    if (!videoType)
      throw new Error('invalid bilibili url')
    if (videoType !== 'BV')
      throw new Error('only BV videos are supported')

    const html = await getHTML(options.url)
    const video = parseHTML(options.url, html)
    const playInfo = await getPlayInfo(video)
    const audio = playInfo.dash.audio.sort((a, b) => b.bandwidth - a.bandwidth)[0]
    const filename = await downloadAudio(video.title, audio.base_url)

    return {
      title: video.title,
      filename,
    }
  }
}
