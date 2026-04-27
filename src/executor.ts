import type { Options, PlatformProcessor, ProcessResult, TaskOptions } from './types'

export function createTaskOptions(options: Options): TaskOptions[] {
  return options.url.map(url => ({
    ...options,
    url,
  }))
}

export async function executeTasks(options: Options, processor: PlatformProcessor): Promise<ProcessResult[]> {
  const results: ProcessResult[] = []

  for (const task of createTaskOptions(options))
    results.push(await processor.process(task))

  return results
}
