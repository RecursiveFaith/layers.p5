const fs = require('fs')
const cpx = require('cpx')
const artIndex = require('../docs/art/index.json')
let sketchName = process.argv[2]

// Set sketchName to YY-MM-DD if not provided
if (!sketchName) {
  let date = new Date()
  sketchName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

// Create new sketch
let dir = `./docs/.vuepress/public/sketch/${sketchName}`
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}
cpx.copy('./node_scripts/templates/sketch.js', `${dir}`, {
  update: true
})

// Read template file and replace %%%filename%%% with sketchName
let template = fs.readFileSync('./node_scripts/templates/art.md', 'utf8')
template = template.replace(/%%%filename%%%/g, sketchName)

// Create new markdown
let file = `./docs/art/${sketchName}.md`
fs.writeFileSync(file, template)

// Update art index
artIndex.push({
  text: sketchName,
  link: `/art/${sketchName}`
})
fs.writeFileSync('./docs/art/index.json', JSON.stringify(artIndex, null, 2))