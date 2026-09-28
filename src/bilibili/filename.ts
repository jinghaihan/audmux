export function toAudioFilename(title: string): string {
  const name = title
    .replace(/[<>:"/\\|?*\p{Cc}]/gu, '_')
    .trim()
    .replace(/[. ]+$/g, '') || 'untitled'

  const safeName = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name)
    ? `_${name}`
    : name

  return `${safeName}.m4a`
}
