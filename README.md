<p><img src="./docs/.vuepress/public/layersp5-title.png" alt="Layers.p5" title="Layers.p5" style="width: 100%; position: relative; top: 5px"></p>


<img src="https://github.com/layersp5/Layers.p5/assets/69949201/7d59086b-00cb-4187-b12f-c7a9ddd38386" width="100%">

# A multi-canvas p5.js extension that adds MIDI binding and gesture controls, CLI tooling, and more

<br>
<hr>
<br>

# Features

<table style="width: 100%;">
  <tr>
    <td width="50%">
      <h4>Organize and stack code across multiple responsive <code>Layers</code>, files, and URLs</h4>
      <img height=200 src="https://github.com/layersp5/Layers.p5/assets/69949201/49cb1f3b-c8b1-4710-ad97-996632492ce3">
    </td>
    <td width="50%">
      <h4>Edit variables by right clicking on a <code>Layer</code>'s pixels and map them to MIDI</h4>
      <img height=200 src="https://github.com/layersp5/Layers.p5/assets/69949201/70aff103-32e5-47d1-bce3-1c288dbb05f4">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h4>Right click to download stacks of Layers as GIFs and videos</h4>
      <img height=200 src="https://github.com/layersp5/Layers.p5/assets/69949201/bd842819-db9b-4a4f-960a-874ef2b0e225">
    </td>
    <td width="50%">
      <h4>Use via CDN or npm or clone the library directly to take advantage of the <abbr title="Command Line Interface">CLI</abbr></h4>
      <img height=200 src="https://github.com/layersp5/Layers.p5/assets/69949201/88b094d8-a275-4e62-acb9-32310c9b702d">
    </td>
  </tr>
</table>

<br>
<hr>
<br>

# Getting Started
## Normally with p5.js you have one `setup()` and `draw()`
```html
<script>
let canvas
  
function setup () {
  canvas = createCanvas(width, height)
  canvas.parent('#target-container')
  textAlign(CENTER)
}

function draw () {
  background(0)
  stroke(255)
  text('Hello world', width/2, height/2)
}
</script>
```

## But with Layers.p5 you can split your code across many
```html
<script>
// Create a new managed canvas
new Layer({
  // (Optional) Reference this Layer with Layers[id]
  id: 'hello',
  
  // (Optional) Defaults to same size as .target (fullscreen if no .target)
  width: 250,
  height: 250,

  // (Optional) Goes at the end of <body> by default
  target: '#target-container',
  
  // (Optional) A new canvas is automatically created
  setup () {
    // p5 methods automatically point to this.canvas
    textAlign(CENTER)
  },
  
  draw () {
    background(0)
    text('Hello world', width/2, height/2)
  }
})
</script>
```

# More info coming soon

<br>
<hr>
<br>

# Install
## Either with HTML
```html
<script src="https://unpkg.com/p5@1.6.0/lib/p5.min.js"></script>
<script src="https://unpkg.com/layers.p5@0.3.0/dist/layers.p5.js"></script>
```

## or with NPM
From command line:
```bash
npm i p5 layers.p5
```
Inside your app.js:
```js
import 'p5'
import Layers from 'Layers.p5'
```

## or on [OpenProcessing.org](https://openprocessing.org)
Add Layers.p5 to your Libraries: `https://unpkg.com/layers.p5@0.3.0/dist/layers.p5.js`


<br>
<hr>
<br>


# Acknowledgements
- Windows 98.css Theme forked from: https://jdan.github.io/98.css/
- https://www.svgrepo.com/svg/499639/reload