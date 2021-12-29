import { defineConfig } from 'vite'
import { presetUno, presetAttributify } from 'unocss'
import { presetGlyph } from './src'
import unocss from 'unocss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetGlyph(),
      ],
    }),
  ],
  build: {
    minify: false,
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['unocss'],
    },
  },
}))
