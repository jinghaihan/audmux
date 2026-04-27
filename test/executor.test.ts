import type { Options, PlatformProcessor, ProcessResult, TaskOptions } from '../src/types'
import { describe, expect, it, vi } from 'vitest'
import { createTaskOptions, executeTasks } from '../src/executor'

describe('download helpers', () => {
  it('creates task options for every normalized url', () => {
    expect(createTaskOptions(createOptions({
      url: [
        'https://www.bilibili.com/video/BV1d4AfzSEBm',
        'https://www.bilibili.com/video/BV1xx411c7mD',
      ],
    }))).toEqual([
      {
        cwd: undefined,
        limit: 5,
        platform: 'bilibili',
        retries: 3,
        url: 'https://www.bilibili.com/video/BV1d4AfzSEBm',
      },
      {
        cwd: undefined,
        limit: 5,
        platform: 'bilibili',
        retries: 3,
        url: 'https://www.bilibili.com/video/BV1xx411c7mD',
      },
    ])
  })

  it('runs normalized urls sequentially', async () => {
    const calls: string[] = []
    const processor: PlatformProcessor = {
      process: vi.fn(async ({ url }: TaskOptions): Promise<ProcessResult> => {
        calls.push(url)
        return {
          title: url,
          filename: `${calls.length}.m4a`,
        }
      }),
    }

    const results = await executeTasks(createOptions({
      url: [
        'https://www.bilibili.com/video/BV1d4AfzSEBm',
        'https://www.bilibili.com/video/BV1xx411c7mD',
      ],
    }), processor)

    expect(calls).toEqual([
      'https://www.bilibili.com/video/BV1d4AfzSEBm',
      'https://www.bilibili.com/video/BV1xx411c7mD',
    ])
    expect(results).toHaveLength(2)
  })
})

function createOptions(overrides: Partial<Options>): Options {
  return {
    platform: 'bilibili',
    url: ['https://www.bilibili.com/video/BV1d4AfzSEBm'],
    limit: 5,
    retries: 3,
    ...overrides,
  }
}
