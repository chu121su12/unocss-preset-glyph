# unocss-preset-glyphs

Embed subset of glyphs from fonts for [UnoCSS](https://github.com/antfu/unocss).

## Installation

```sh
npm i unocss-preset-glyphs unocss --save-dev
pnpm add unocss-preset-glyphs unocss -D
```

## Usage

```js
// unocss.config.js
import { presetUno, defineConfig } from 'unocss'
import { presetGlyphs } from 'unocss-preset-glyphs'

export default defineConfig({
  presets: [
    presetUno(), // required
    presetGlyphs({
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
