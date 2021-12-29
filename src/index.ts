import type { CSSValues, Preset } from '@unocss/core'
import { warnOnce } from '@unocss/core'

/**
 * @public
 */
export interface GlyphOptions {
  /**
   * List of font and its path.
   *
   */
  fonts?: Record<string, string>
  /**
   * Class prefix for matching glyph rules.
   *
   * @default `g-`
   */
  prefix?: string
  /**
   * Emit warning when font/glyph cannot be resolved.
   *
   * @default false
   */
  warn?: boolean
  /**
   * Rule layer
   *
   * @default 'glyphs'
   */
  layer?: string
}

/**
 * @public
 */
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

const isNode = typeof process < 'u' && typeof process.stdout < 'u'

let Fontmin
if (isNode) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Fontmin = require('fontmin')
}

function subsetFont(path: string, glyphs: string) {
  return new Promise<string | undefined>((resolve) => {
    if (!isNode)
      return resolve(undefined)

    const f = new Fontmin().src(path)

    if (path.match(/\.otf$/))
      f.use(Fontmin.otf2ttf())

    f.use(Fontmin.glyph({ text: glyphs }))
      .use(Fontmin.css({ base64: true }))

    f.run((err: any, files: any[]) => {
      if (err)
        return resolve(undefined)
      const fontData = files[1].contents.toString().replace(/^[\s\S]*?;base64,([^)]+)\)[\s\S]*$/, '$1')
      resolve(fontData)
    })
  })
}
