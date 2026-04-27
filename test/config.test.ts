import process from 'node:process'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveConfig } from '../src/config'

describe('resolveConfig', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('injects default limit and retries values', () => {
    expect(resolveConfig({
      url: 'https://www.bilibili.com/video/BV1d4AfzSEBm',
    })).toMatchObject({
      url: ['https://www.bilibili.com/video/BV1d4AfzSEBm'],
      platform: 'bilibili',
      limit: 5,
      retries: 3,
    })
  })

  it('accepts custom limit and retries values', () => {
    expect(resolveConfig({
      url: 'https://www.bilibili.com/video/BV1d4AfzSEBm',
      limit: 5,
      retries: 1,
    })).toMatchObject({
      limit: 5,
      retries: 1,
    })
  })

  it('normalizes a single bilibili bv into a url array', () => {
    expect(resolveConfig({
      bv: 'BV1d4AfzSEBm',
    })).toMatchObject({
      url: ['https://www.bilibili.com/video/BV1d4AfzSEBm'],
      platform: 'bilibili',
    })
  })

  it('normalizes repeated url and bv values into a single url array', () => {
    expect(resolveConfig({
      url: [
        'https://www.bilibili.com/video/BV1d4AfzSEBm',
        'https://www.bilibili.com/video/BV1xx411c7mD',
      ],
      bv: ['BV17x411w7KC', 'BV1Q541167Qg'],
    })).toMatchObject({
      url: [
        'https://www.bilibili.com/video/BV1d4AfzSEBm',
        'https://www.bilibili.com/video/BV1xx411c7mD',
        'https://www.bilibili.com/video/BV17x411w7KC',
        'https://www.bilibili.com/video/BV1Q541167Qg',
      ],
      platform: 'bilibili',
    })
  })

  it('rejects empty inputs', () => {
    expectResolveConfigExit({})
  })

  it('rejects unsupported urls', () => {
    expectResolveConfigExit({
      url: 'https://example.com/video/1',
    })
  })
})

function expectResolveConfigExit(input: Parameters<typeof resolveConfig>[0]) {
  vi.spyOn(process, 'exit').mockImplementation((code?: string | number | null) => {
    throw new Error(`process.exit:${code ?? 0}`)
  })

  expect(() => resolveConfig(input)).toThrowError('process.exit:1')
}
