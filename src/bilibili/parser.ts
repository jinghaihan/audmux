import type { InitialState, ParsedVideoPage, VideoPage } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { JSONParse } from '../utils'
import { STATE_RE } from './patterns'

function resolveCID(url: string, pages: VideoPage[]) {
  const page = Number(new URL(url).searchParams.get('p') ?? '1')
  const index = Number.isInteger(page) && page > 0 ? page - 1 : 0
  return pages[index]?.cid ?? pages[0]?.cid
}

export function parseHTML(url: string, html: string): ParsedVideoPage {
  const stateMatch = html.match(STATE_RE)?.[1]

  if (!stateMatch) {
    p.outro(`${c.red`failed to parse BV`}`)
    process.exit(1)
  }

  const initialState = JSONParse<InitialState>(stateMatch)
  const cid = resolveCID(url, initialState.videoData.pages)
  const wbiImgKey = initialState.defaultWbiKey?.wbiImgKey
  const wbiSubKey = initialState.defaultWbiKey?.wbiSubKey

  if (!cid || !wbiImgKey || !wbiSubKey) {
    p.outro(`${c.red`failed to parse BV`}`)
    process.exit(1)
  }

  return {
    aid: initialState.videoData.aid,
    title: initialState.videoData.title,
    bvid: initialState.videoData.bvid,
    cid,
    owner: initialState.videoData.owner.name,
    wbiImgKey,
    wbiSubKey,
  }
}
