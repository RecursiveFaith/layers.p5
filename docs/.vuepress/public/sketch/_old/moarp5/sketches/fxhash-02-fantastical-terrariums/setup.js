
/**
 * 🧰 Settings
 * --------------------------------------------------
 * These can also be configured through ?queryString params ✨
 * @todo Add these to right click menu
 */
 function preload () {
  params = Object.assign({
    fps: 30,
    loop: 0,
    size: 8,
    animate: 1,
    seed: null,
		
		// Use 0 for just one big canvas
    spaces: 0,
  }, getURLParams())

  // Setup seed
  Seed = params.seed || floor(fxrand() * 9999999)
  randomSeed(Seed)
  noiseSeed(Seed)
  
  // Setup initial settings
  sphereRadius = 200

  // Console message
  console.log(`
 _____         _           _   _         _    _____                     _           
|   __|___ ___| |_ ___ ___| |_|_|___ ___| |  |_   _|___ ___ ___ ___ ___|_|_ _ _____ 
|   __| .'|   |  _| .'|_ -|  _| |  _| .'| |    | | | -_|  _|  _| .'|  _| | | |     |
|__|  |__,|_|_|_| |__,|___|_| |_|___|__,|_|    |_| |___|_| |_| |__,|_| |_|___|_|_|_|

(∩\｀-\´)⊃━☆ﾟ.*・｡ﾟ "Fantastical Terrarium"
Coded with passion and love by @Metamoar
Made with moarP5.js - Do mooooooar with p5.js!

Twitter: https://twitter.com/Metamoar
Devlog: https://metamoar.notion.site/2b8d00e6d0444ec782a43063d1f04804
Personal site: https://metamoar.xyz
  `)
}

/**
 * Called on moar.recreate()
 */
function onSettings (menu) {
  menu.general.children[0].dispose()
  
  menu.general.addInput(this.store, 'NumTrees', {
    min: 24,
    max: 96,
    step: 1
  }).on('change', (ev) => {
    NumTrees = ev.value
    this.recreate()
  })
  menu.general.addInput(this.store, 'Position', {
    min: 0,
    max: 8,
    step: 1
  }).on('change', (ev) => {
    Position = ev.value
    this.recreate()
  })
  menu.general.addInput(this.store, 'EyeDensity', {
    min: 0,
    max: 100,
    step: 1
  }).on('change', (ev) => {
    EyeDensity = ev.value
    this.recreate()
  })

  menu.general.addInput(this.store, 'Terrarium', {
    min: 3,
    max: 8,
    step: 1
  })
  .on('change', (ev) => {
    Terrarium = ev.value
    this.recreate()
  })
  menu.general.addInput(this.store, 'FrameWidth', {
    min: 0,
    max: 24,
    step: 2
  })
  .on('change', (ev) => {
    FrameWidth = ev.value
  })
  menu.general.addInput(this.store, 'FrameOpacity', {
    min: 0,
    max: 255,
    step: 5
  })
  .on('change', (ev) => {
    FrameOpacity = ev.value
  })


  menu.general.addInput(this.store, 'Background', {
    min: 0,
    max: 4,
    step: 1
  })
  .on('change', (ev) => {
    Background = ev.value
  })
  menu.general.addInput(this.store, 'BGColor', {
    min: 0,
    max: this.bgColors.length-1,
    step: 1
  })
  .on('change', (ev) => {
    BGColor = ev.value
    this.bg = ev.value
  })
  menu.general.addInput(this.store, 'BGColor2', {
    min: 0,
    max: this.bgColors.length-1,
    step: 1
  })
  .on('change', (ev) => {
    BGColor2 = ev.value
    this.bg = ev.value
  })

  menu.general.addInput(this.store, 'TreeColor1', {
    min: 0,
    max: this.bgColors.length-1,
    step: 1
  })
  .on('change', (ev) => {
    TreeColor1 = ev.value
    this.recreate()
  })
  menu.general.addInput(this.store, 'TreeColor2', {
    min: 0,
    max: this.bgColors.length-1,
    step: 1
  })
  .on('change', (ev) => {
    TreeColor2 = ev.value
    this.recreate()
  })

  menu.general.addInput(this.store, 'Seed', {
    min: 0,
    max: 10000,
    step: 1
  })
  .on('change', (ev) => {
    Seed = ev.value
    this.recreate()
  })
}

/**
 * Generate noise
 */
function generateNoise () {
  // Setup noise overlay
  noiseOverlay.pixelDensity(1)
  noiseOverlay.loadPixels()
  for (let i = 0; i < noiseOverlay.pixels.length; i += 4 * (floor(width % 2) + 3)) {
    noiseOverlay.pixels[i] = 255
    noiseOverlay.pixels[i+1] = 255
    noiseOverlay.pixels[i+2] = 255
    noiseOverlay.pixels[i+3] = random(60)

    noiseOverlay.pixels[i+4] = 255
    noiseOverlay.pixels[i+5] = 255
    noiseOverlay.pixels[i+6] = 255
    noiseOverlay.pixels[i+7] = random(60)
  }
  noiseOverlay.updatePixels()
  // Without this the sketch will freeze!
  noiseOverlay.pixels = []
}  

/**
 * Recenter
 */
function recenter () {
  // Center
  _renderer.position(width / 2 - width / 2, height / 2 - height / 2, 'fixed')
  offscreen.position(width / 2 - width / 2, height / 2 - height / 2, 'fixed')
  noiseOverlay.position(width / 2 - width / 2, height / 2 - height / 2, 'fixed')
}  

/**
 * Sketch entry point
 */
 function setup () {
  !params.record && params.fps && frameRate(params.fps)

  createCanvas(windowWidth, windowHeight)
  offscreen = createGraphics(width, height)
  noiseOverlay = createGraphics(width, height)
  treeCanvas = createGraphics(width, height)
  webglCanvas = createGraphics(width, height, WEBGL)

  pixelDensity(1)
  offscreen.pixelDensity(1)
  noiseOverlay.pixelDensity(1)
  treeCanvas.pixelDensity(1)
  webglCanvas.pixelDensity(1)

  // Webgl
  cam = webglCanvas.createCamera()

  setupScene(true)
}

/**
 * Tap with two fingers to recreate sketch
 */
function touchStarted () {
  if (touches.length > 1) {
    setupScene(true)
  }
}

/**
 * Handle keypressed across multiple files
 */
function windowResized () {
  resizeCanvas(windowWidth, windowHeight)
  offscreen.resizeCanvas(width, height)
  noiseOverlay.resizeCanvas(width, height)
  treeCanvas.resizeCanvas(width, height)
  webglCanvas.resizeCanvas(width, height)
  setupScene()
}

/**
 * Handle keypressed across multiple files
 */
function keyPressed (ev) {
  if (ev.code === 'KeyR') {
    setupScene(true)
  } else {
    setupScene()
  }
}