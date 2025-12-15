import type { CAC } from 'cac'
import type { CommandOptions } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { cac } from 'cac'
import { resolveConfig } from './config'
import { NAME, VERSION } from './constants'
import { getPlatformProcessor } from './platforms'

try {
  const cli: CAC = cac(NAME)

  cli
    .command('', 'Command description')
    .option('--url <url>', 'The url of the video')
    .allowUnknownOptions()
    .action(async (options: Partial<CommandOptions>) => {
      p.intro(`${c.yellow`${NAME} `}${c.dim`v${VERSION}`}`)

      const spinner = p.spinner()
      spinner.start('resolving config')
      const config = resolveConfig(options)
      spinner.stop('config resolved')

      spinner.start('processing video')
      const processor = getPlatformProcessor(config.platform)
      const result = await processor.process(config)
      spinner.stop('processing completed')

      p.outro(`${c.green`downloaded: ${result.filename}`}`)
    })

  cli.help()
  cli.version(VERSION)
  cli.parse()
}
catch (error) {
  console.error(error)
  process.exit(1)
}
