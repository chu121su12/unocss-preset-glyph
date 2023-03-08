import { defineConfig } from 'vite'
import { presetUno } from 'unocss'
import { presetGlyph } from './src'
import { presetTypography } from 'unocss'
import unocss from 'unocss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    unocss({
      presets: [
        presetGlyph({
          fonts: {
            inter: 'node_modules/inter-ui/Inter (web latin)/Inter-Regular.woff',
            inconsolata: 'node_modules/inconsolata/inconsolata.woff',
          },
        }),
        presetUno(),
        presetTypography({
          cssExtend: {
            code: {
              color: '#8b5cf6',
            },
            'a:hover': {
              color: '#f43f5e',
              'text-decoration': 'none',
            },
            'a:visited': {
              color: '#14b8a6',
            },
          },
        }),
      ],
    }),
  ],
  build: {
    minify: mode === 'demo',
    lib:
      mode === 'demo'
        ? false
        : {
            entry: './src/index.ts',
            formats: ['es'],
            fileName: () => 'index.js',
          },
    rollupOptions: {
      external: ['unocss'],
    },
  },
}))
