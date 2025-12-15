import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index', 'src/cli'],
  format: 'esm',
  clean: true,
})
