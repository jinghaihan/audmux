import { describe, expect, it } from 'vitest'
import { toAudioFilename } from '../src/bilibili/filename'

describe('toAudioFilename', () => {
  it('replaces path separators in a Bilibili title', () => {
    expect(toAudioFilename('【AI/BL】来源不明的爱 [OST] 내게 와（Come to Me）含未公开片段'))
      .toBe('【AI_BL】来源不明的爱 [OST] 내게 와（Come to Me）含未公开片段.m4a')
  })

  it('handles empty, reserved, and other invalid names', () => {
    expect(toAudioFilename('  ...  ')).toBe('untitled.m4a')
    expect(toAudioFilename('CON')).toBe('_CON.m4a')
    expect(toAudioFilename('CON.notes')).toBe('_CON.notes.m4a')
    expect(toAudioFilename('a\\b:c?d*e|f<g>h"i')).toBe('a_b_c_d_e_f_g_h_i.m4a')
  })
})
