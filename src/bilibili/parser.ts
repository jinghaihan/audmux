import type { InitialState, PlayInfo } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { JSONParse } from '../utils'
import { PLAY_RE, STATE_RE } from './patterns'

export function parseHTML(url: string, html: string) {
  const stateMatch = html.match(STATE_RE)?.[1]
  const playMatch = html.match(PLAY_RE)?.[1]

  if (!stateMatch || !playMatch) {
    p.outro(`${c.red`failed to parse BV`}`)
    process.exit(1)
  }

  const initialState = JSONParse<InitialState>(stateMatch)
  const playInfo = JSONParse<PlayInfo>(playMatch)

  const audio = playInfo.data.dash.audio.sort((a, b) => b.bandwidth - a.bandwidth)[0]

  return {
    title: initialState.videoData.title,
    bvid: initialState.videoData.bvid,
    onwer: initialState.videoData.owner.name,
    audio,
    duration: playInfo.data.dash.duration,
  }
}
