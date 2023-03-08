import fs from 'fs'

const isNode = typeof process < 'u' && typeof process.stdout < 'u'

async function loadFontmin() {
  try {
    return (await import('fontmin'))['default']
  }
  catch { }
}

async function loadWawoff2() {
  try {
    return await import('wawoff2')
  }
  catch { }
}

async function loadWoff2sfntSfnt2woff() {
  try {
    return await import('woff2sfnt-sfnt2woff')
  }
  catch { }
}

export function subsetFont(path: string, glyphs: string) {
  let Fontmin: { new(): { (): any; new(): any; src: { (arg0: string): any; new(): any; }; }; otf2ttf: () => any; glyph: (arg0: { text: string; }) => any; css: (arg0: { base64: boolean; }) => any; };

  return new Promise<string | undefined>(async (resolve) => {
    if (!isNode)
      return resolve(undefined)

    if (!Fontmin)
      Fontmin = await loadFontmin()

    if (path.match(/\.woff2$/)) {
      let buffer = fs.readFileSync(path)
      const wawoff2 = await loadWawoff2()

      const tempPath = './temp/tmp2.ttf'
      fs.writeFileSync(tempPath, await wawoff2.decompress(buffer))
      path = tempPath
    }
    else if (path.match(/\.woff$/)) {
      let buffer = fs.readFileSync(path)
      const wssw = await loadWoff2sfntSfnt2woff()
      buffer = wssw.toSfnt(buffer);

      const tempPath = './temp/tmp1.ttf'
      fs.writeFileSync(tempPath, buffer)
      path = tempPath
    }

    const f = new Fontmin().src(path)

    if (path.match(/\.otf$/))
      f.use(Fontmin.otf2ttf())

    f.use(Fontmin.glyph({ text: glyphs }))
      .use(Fontmin.css({ base64: true }))

    f.run((err: any, files: any[]) => {
      if (!err) {
        const fontData = files[1].contents.toString().replace(/^[\s\S]*?;base64,([^)]+)\)[\s\S]*$/, '$1')
        resolve(fontData)
      }

      resolve(undefined)
    })
  })
}
