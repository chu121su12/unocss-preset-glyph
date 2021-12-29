import type { CSSValues, Preset } from '@unocss/core'
import { warnOnce } from '@unocss/core'
import { subsetFont } from './utils'
import type { GlyphOptions } from './types'

export { GlyphOptions }

export const presetGlyph = (options: GlyphOptions = {}): Preset => {
  const {
    prefix = 'g-',
    warn = false,
    layer = 'glyphs',
    fonts = {},
  } = options

  const fontNameMap: Record<string, string> = {}

  return {
    name: 'unocss-preset-glyph',
    enforce: 'pre',
    options,
    layers: {
      glyphs: -10,
    },
    postprocess: (obj) => {
      if (obj.selector.includes(prefix)
        && obj.entries.length === 2
        && obj.entries.find(([prop]) => prop === 'font-family')
        && obj.entries.find(([prop]) => prop === 'src'))
        obj.selector = '@font-face'
    },
    rules: [[
      new RegExp(`^${prefix}([\\w]+)-(.+)$`),
      async([match, fontAlias, glyphs]: string[]): Promise<CSSValues | undefined> => {
        if (!glyphs)
          return

        const path = fonts[fontAlias]
        if (!path) {
          if (warn)
            warnOnce(`no font defined for "${fontAlias}"`)
          return
        }

        // Subset space only if there's underscore
        if (glyphs.includes('_'))
          glyphs = ` ${glyphs}`

        const fontData = await subsetFont(path, glyphs.replace(
          /[a-zA-Z]/g, c => `${c.toUpperCase()}${c.toLowerCase()}`
        ))

        if (!fontData) {
          if (warn)
            warnOnce(`failed to load/subset font "${fontAlias}" at "${path}"`)
          return
        }

        if (!fontNameMap[match])
          fontNameMap[match] = `${fontAlias}-${Object.keys(fontNameMap).length}`

        const fontName = fontNameMap[match]

        return [
          {
            'font-family': fontName,
            'src': `url(data:application/x-font-ttf;charset=utf-8;base64,${fontData}) format("truetype")`,
          },
          {
            'font-family': fontName,
          },
        ]
      },
      { layer },
    ]],
  }
}

export default presetGlyph
