# unocss-preset-glyph

Embed subset of glyphs from fonts for [UnoCSS](https://github.com/antfu/unocss).

## Installation

```sh
npm i unocss-preset-glyph unocss --save-dev
pnpm add unocss-preset-glyph unocss -D
```

## Usage

```js
// unocss.config.js
import { presetUno, defineConfig } from 'unocss'
import { presetGlyph } from 'unocss-preset-glyph'

export default defineConfig({
  presets: [
    presetUno(), // required
    presetGlyph({
        fonts: {
            comicsans: '/path/to/comicsans.ttf',
            // ...
        },
    }),
  ],
})
```

```html
<h1 class="g-comicsans-uno hover:g-comicsans-cs">UnoCSS</h1>
```

## License

MIT
