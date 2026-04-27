export function JSONParse<T = any>(content: string): T {
  return JSON.parse(content) as T
}

export function toArray<T = string>(input: T | T[] | undefined) {
  if (!input)
    return []
  return Array.isArray(input) ? input : [input]
}

export function detectPlatform(url: string): 'bilibili' | 'unknown' {
  if (url.includes('bilibili.com'))
    return 'bilibili'

  return 'unknown'
}
