import type { VIDEO_TYPE } from './constants'

export type VideoType = (typeof VIDEO_TYPE)[keyof typeof VIDEO_TYPE]

export interface InitialState {
  videoData: VideoData
  [key: string]: unknown
}

export interface VideoData {
  bvid: string
  title: string
  owner: VideoOwner
  [key: string]: unknown
}

export interface VideoOwner {
  name: string
  [key: string]: unknown
}

export interface PlayInfo {
  data: PlayInfoData
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
