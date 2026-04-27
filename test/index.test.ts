import { describe, expect, it } from 'vitest'
import { parseHTML } from '../src/bilibili/parser'

describe('parseHTML', () => {
  it('parses BV pages without inline playinfo', () => {
    const html = `<script>window.__INITIAL_STATE__=${JSON.stringify({
      defaultWbiKey: {
        wbiImgKey: 'img-key',
        wbiSubKey: 'sub-key',
      },
      videoData: {
        aid: 123,
        bvid: 'BV1xx411c7mD',
        title: 'demo title',
        owner: {
          name: 'demo owner',
        },
        pages: [
          { cid: 11 },
          { cid: 22 },
        ],
      },
    })};(function(){})</script>`

    expect(parseHTML('https://www.bilibili.com/video/BV1xx411c7mD?p=2', html)).toEqual({
      aid: 123,
      bvid: 'BV1xx411c7mD',
      cid: 22,
      owner: 'demo owner',
      title: 'demo title',
      wbiImgKey: 'img-key',
      wbiSubKey: 'sub-key',
    })
  })
})
