import type { CAC } from 'cac'
import type { CommandOptions } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { cac } from 'cac'
import { resolveConfig } from './config'
import { NAME, VERSION } from './constants'
import { executeTasks } from './executor'
import { getPlatformProcessor } from './platforms'

try {
  const cli: CAC = cac(NAME)

  cli
    .command('', 'Command description')
    .option('--url <url>', 'The url of the video')
    .option('--bv <bv>', 'The Bilibili BV id of the video')
    .option('--limit <n>', 'The maximum number of concurrent downloads')
    .option('--retries <n>', 'The number of retries for failed downloads')
    .allowUnknownOptions()
    .action(async (options: Partial<CommandOptions>) => {
      p.intro(`${c.yellow`${NAME} `}${c.dim`v${VERSION}`}`)

      const spinner = p.spinner()
      spinner.start('resolving config')
      const config = resolveConfig(options)
      spinner.stop('config resolved')

      spinner.start('processing video')
      const processor = getPlatformProcessor(config.platform)
      const results = await executeTasks(config, processor)
      spinner.stop('processing completed')

      if (results.length === 1) {
        p.outro(`${c.green`downloaded: ${results[0].filename}`}`)
        return
      }

      p.outro(`${c.green`downloaded ${results.length} files`}`)
    })

  cli.help()
  cli.version(VERSION)
  cli.parse()
}
catch (error) {
  console.error(error)
  process.exit(1)
}
