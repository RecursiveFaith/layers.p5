const fs = require('fs')
const fsExtra = require('fs-extra')
const artIndex = require('../docs/art/index.json')
let sketchName = process.argv[2]
let newSketch = process.argv[3] || sketchName + '-remix'

// Clone directory
fsExtra.copySync(`./docs/.vuepress/public/sketch/${sketchName}`, `./docs/.vuepress/public/sketch/${newSketch}`)

// Clone markdown
fs.copyFileSync(`./docs/art/${sketchName}.md`, `./docs/art/${newSketch}.md`)
// Edit the new markdown and replace instances of process.argv[2] with process.argv[3]
let md = fs.readFileSync(`./docs/art/${newSketch}.md`, 'utf8')
md = md.replace(new RegExp(sketchName, 'g'), newSketch)
fs.writeFileSync(`./docs/art/${newSketch}.md`, md)

// Update art index
// Find index with sketchName
let index = artIndex.findIndex(i => i.link === `/art/${sketchName}`)
artIndex.push({
  text: `${newSketch} (Remix from ${artIndex[index].text})`,
  link: `/art/${newSketch}`
})
fs.writeFileSync('./docs/art/index.json', JSON.stringify(artIndex, null, 2))