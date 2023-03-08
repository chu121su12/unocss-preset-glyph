import { describe, expect, it } from 'vitest'
import { createGenerator, presetUno } from 'unocss'
import { presetGlyph } from '../src/index'

describe('glyph preset', async () => {
  it('generate font subset', async () => {
    const generator = createGenerator({
      presets: [
        presetGlyph({
          fonts: {
            inter: 'node_modules/inter-ui/Inter (web latin)/Inter-Regular.woff',
            inconsolata: 'node_modules/inconsolata/inconsolata.woff',
          },
        }),
        presetUno(),
      ],
    })

    const target = [
      'g-inter-uno',
      'hover:g-inconsolata-cs',
    ].join(' ')

    const { css } = await generator.generate(target, { preflights: false })
    expect(css).contains('.g-inter-uno{font-family:un-inter-1;}')
    expect(css).contains('@font-face{font-family:un-inter-1;src:url(data:application/x-font-ttf;')
    expect(css).contains('.hover\\:g-inconsolata-cs:hover{font-family:un-inconsolata-0;}')
    expect(css).contains('@font-face{font-family:un-inconsolata-0;src:url(data:application/x-font-ttf;')
  })
})
