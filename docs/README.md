<p><img src="/layersp5-title.png" alt="Layers.p5" title="Layers.p5" style="width: 100%; position: relative; top: 5px"></p>
<p class="verticle-middle-children space-children text-center"><a href="https://github.com/layersp5/layers.p5"><img src="https://img.shields.io/github/stars/layersp5/layers.p5?style=social"></a> <a href="https://github.com/layersp5/layers.p5"><img src="https://img.shields.io/github/last-commit/layersp5/layers.p5.svg"></a> <a href="https://github.com/layersp5/layers.p5"><img src="https://img.shields.io/github/tag/layersp5/layers.p5.svg"></a> <a href="https://github.com/layersp5/layers.p5"><img src="https://img.shields.io/github/repo-size/layersp5/layers.p5.svg"></a></p>

<Layer title="Living Room Sunsets" :layers="['@minacoding-10/bg', '@minacoding-10/sky', '@minacoding-10/mountains', '@minacoding-10/window']" help="@minacoding-10" height=300 />

## Layers.p5 is an Object Oriented extension
### It works the same, it's just organized into Layers. In fact, migrating a sketch is as simple as moving your `setup()` and `draw()` functions into a `new Layer()`

<div class="row">
<div class="col-6">
<h4>p5</h4>

```js
function setup () {
  createCanvas(400, 400)
}

function draw () {
  background(0)
}

// Other code can remain where it is
```

</div>
<div class="col-6">
<h4>Layers.p5</h4>

```js
new Layer({
  setup () {
    createCanvas(400, 400)
  },

  draw () {
    background(0)
  }
})
```

</div>
</div>

<br>
<br>
<br>

### In Layers you treat sketches as objects. By default, a fullscreen canvas is created but you can pass a `width` and `height` also. The above can be rewritten as:

<br>

<div class="row">
<div class="col-6">

```js
let sketch = {
  width: 400,
  height: 400,
  draw () {
    background(0)
  }
}
new Layer(sketch)
```

or if you want a responsive canvas, then just:

```js
new Layer({
  draw () {
    background(0)
  }
})
```

</div>
<div class="col-6">
  <Layer title="" height=425 :layers="['@quickstart/bg0']" />
</div>
</div>
<br>



<br>
<hr>
<br>



## Layer defaults
### Each Layer comes with a default color palette, which it gets from `Layers.default`. Often it's useful to explore variations and looping through your palette and other params could be one way to quickly explore themes:

```js
// Loop through default colors
Layers.default.colors.forEach(col => {
  // Create a new layer to visualize each color
  new Layer({
    draw () {
      // All defaults are passed into the Layer
      background(this.colors[col])
    }
  })
})
```

<br>

<div class="row">
  <div class="col-3" v-for="n in 6" :param="n">
    <Layer :title="'$bg = ' + (n-1)" height=110 :layers="['@quickstart/bg']" :presets="{bg: n-1}" />
  </div>
</div>

### Here are the full list of defaults, which can be updated at any time. Some of these are shorthands for p5 methods, which will be set at the start of `setup()`

```js
new Layer({
  id: Layers.curId++,     // auto-incrementing id
  noLoop: false,          // True: Only runs draw() once, False: Loops
  disabled: false,        // Prevents both setup() and draw() from running
  menuDisabled: false,    // Disables right-click menu
  type: 'layer',          // ['layer', 'filter']
  target: document.body,  // Where to append the canvas
  stack: 'global',        // This is used for grouping layers
                          //     so you can have multiple layers with the same id

  wait: null,             // List of other Layers.id to wait for before running setup()

  renderer: P2D,          // [P2D, WEBGL]
  fps: 30,                // Sets a custom frameRate
  pixelDensity: 0,        // 0 for system default
  frameCount: 0,          // The frameCount to start at

  colors: ['#FF618B', '#FF9D00', '#FAD000', '#2CA300', '#2EC2B3', '#5D38F0', '#00193D'],
  colorMode: RGB,
  
  width: this.target.clientWidth,    // Canvas width
  height: this.target.clientHeight,  // Canvas height
  x: 0,                              // Global translateX
  y: 0,                              // Global translateY

  // A canvas is automatically created, but you can create a new one
  // or direct p5 methods to an existing one
  canvas: null,

  // A second hidden canvas is also created,
  // which you can use as an offscreen buffer
  offscreen: null,
  offscreenRenderer: opts.renderer || P2D,

  // Things
  things: [],

  // Listeners
  onClick: null,            // Called when the canvas is clicked
  beforeGenerate: null,     // Called before the canvas is regenerated with menu changes
                            //    or before this.generate()
  afterGenerate: null,      // Called after the canvas is regenerated with menu changes
                            //    or after this.generate()
  onDispose: null,          // Called when you free up memory with this.dispose()
  
  methods: {}, // Custom methods
})
```


<br>
<hr>
<br>

## Magic Properties

### Magic Properties are special variables and methods that can be accessed with just `$param1`. There are two ways to define Magic Properties: with `.$` and `.menu`

<br>
<br>
<br>

### `.$` - These are variables and methods that are stored in the Layer and can be accessed with `$param1` or with `Layers[id].$.param1`

```js
// Magic Properties ✨
// Layers will replace $param with either
// this.$[param] or this.menu[param].value
new Layer({
  id: 'helloworld',
  noLoop: false,
  
  $: {
    param1: 'hello',
    
    counter: 0,
    param2 () {return ++$counter},

    param3 (str) {return [$param1, str].join(' ')},
  },

  draw () {
    background(200)
    text($param1, 0, 20)
    text($param2(), 0, 40)
    text($param3('world!'), 0, 60)
  }
})
```

<Layer height=100 :layers="['@quickstart/helloworld']" />


<br>
<br>
<br>

### `.menu` - These Magic Properties generate a menu item for live editing and MIDI binding. They can be accessed with `$param1` or `Layers[id].menu.param1.value`

```js
new Layer({
  menu: {
    // Slider shorthand
    // Same as {type: 'slider', min: 0, max: 1, step: .001}
    // step = 1 if value > 1 else .001
    param1: 1,
    
    // Slider shorthand. Same as {type: 'slider', min: 0, max: 10, step: 1}
    param2: {max: 10, resetOnChange: true},
    
    // Slider defaults
    param3: {
      type: 'slider',
      min: 0,
      max: 10,
      step: 1,
      default () {return ~~random(this.min, this.max)},
      onChange () {},
      resetOnChange: false, // Whether to complete restart the layer or not
    },

    // Dropdown shorthand
    param4: ['option1', 'option2', 'option3'],

    // Dropdown defaults
    param5: {
      type: 'list',     // Not needed if options are defined
      options: [
        'option1',
        'option2',
        'option3'
      ],
      default () {return ~~random(this.min, this.max)},
      onChange () {},
      resetOnChange: false,
    },
  },

  draw () {
    background(200)
    text($param1, 0, 20)
    text($param2, 0, 40)
    text($param3, 0, 60)
    text($param4, 0, 80)
    text($param5, 0, 100)
  }
})
```

<Layer title="Right click to change params" height=120 :layers="['@quickstart/helloworldMenu']" />

<br>
<hr>
<br>

## MIDI binding
`.menu` **Magic Properties** can be bound to physical and digital MIDI controllers by following these steps:
- connect your MIDI controller to your device
- right click on a visible pixel to bring up that Layer's menu
- click "MIDI Settings"
- click "Connect MIDI"
- right click the canvas again to refresh the menu
- if MIDI controllers were connected you'll see "Bind MIDI"
- click "Bind MIDI" and then click the slider or dropdown of the variable you want to bind
- then on your MIDI controller/device physically press the knob or slider you want to bind the variable to

<br>
<hr>
<br>

## Adding Layers.p5 to existing projects

Layers.p5 works by hooking into global p5.js functions and variables and redirecting them to the currently running Layer. Because of this, it should work well alongside any existing p5.js code, as well as other tools and environments.

### Add with HTML
```html
<script src="https://unpkg.com/p5@1.6.0/lib/p5.min.js"></script>
<script src="https://unpkg.com/layers.p5@0.3.0/dist/layers.p5.js"></script>
```

### Or with NPM
From command line:
```bash
npm i p5 layers.p5
```
Inside your app.js:
```js
import 'p5'
import 'Layers.p5'
```

<br>
<hr>
<br>
 
## The Layers.p5 CLI

### `npm run new $slug`
- Clones `./node_scripts/templates/art.md` to `./docs/art/$slug.md`
  - Rewrites the title and slug
  - Adds the page to the sidebar in `./docs/art/index.json`
- Clones `./node_scripts/templates/sketch.js` to `./docs/vuepress/public/sketch/$slug/sketch.js`

<br>
<br>
<br>

### `npm run remix $slug $newSlug`
- Clones `./docs/art/$slug.md` to `./docs/art/$newSlug.md`
  - Rewrites the title and slug
  - Adds the page to the sidebar in `./docs/art/index.json`
- Clones `./docs/vuepress/public/sketch/$slug/..` to `./docs/vuepress/public/sketch/$newSlug/..`

<br>
<br>
<br>

### `npm run delete $slug`
- Deletes `./docs/art/$slug.md`
  - Removes the page from the sidebar

<br>
<hr>
<br>
