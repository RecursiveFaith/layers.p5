const fs = require('fs')
const fsExtra = require('fs-extra')
const artIndex = require('../docs/art/index.json')
let sketchName = process.argv[2]

// Delete directory
fsExtra.removeSync(`./docs/.vuepress/public/sketch/${sketchName}`)

// Delete markdown
fs.unlinkSync(`./docs/art/${sketchName}.md`)

// Update art index
// Find index with sketchName
let index = artIndex.findIndex(i => i.link === `/art/${sketchName}`)
artIndex.splice(index, 1)
fs.writeFileSync('./docs/art/index.json', JSON.stringify(artIndex, null, 2))