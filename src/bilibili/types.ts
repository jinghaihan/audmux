import type { VIDEO_TYPE } from './constants'

export type VideoType = (typeof VIDEO_TYPE)[keyof typeof VIDEO_TYPE]

export interface InitialState {
  defaultWbiKey: DefaultWbiKey
  videoData: VideoData
  [key: string]: unknown
}

export interface DefaultWbiKey {
  wbiImgKey: string
  wbiSubKey: string
  [key: string]: unknown
}

export interface VideoData {
  aid: number
  bvid: string
  pages: VideoPage[]
  title: string
  owner: VideoOwner
  [key: string]: unknown
}

export interface VideoPage {
  cid: number
  [key: string]: unknown
}

export interface VideoOwner {
  name: string
  [key: string]: unknown
}

export interface ParsedVideoPage {
  aid: number
  bvid: string
  cid: number
  owner: string
  title: string
  wbiImgKey: string
  wbiSubKey: string
}

export interface PlayInfoResponse {
  code: number
  data: PlayInfoData
  message: string
  [key: string]: unknown
}

export interface PlayInfoData {
  dash: DashInfo
  [key: string]: unknown
}

export interface DashInfo {
  duration: number
  audio: AudioStream[]
  [key: string]: unknown
}

export interface AudioStream {
  base_url: string
  bandwidth: number
  [key: string]: unknown
}
