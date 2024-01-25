/**
 * Called on moar.recreate()
 */
 function onSettings (menu) {
  // menu.general.children[0].dispose()

  menu.general.addInput(this.store, 'isMonochrome').on('change', ev => {
    this.recreate()
  })

  menu.general.addInput(this.store, 'lineWidth', {
    min: 1,
    max: 10,
    step: 1
  }).on('change', ev => {
    this.recreate()
  })

  menu.general.addInput(this.store, 'lineLen', {
    min: 1,
    max: 40,
    step: 1
  }).on('change', ev => {
    this.recreate()
  })

  menu.general.addInput(this.store, 'gridRes', {
    min: .005,
    max: .05
  }).on('change', ev => {
    this.recreate()
  })

  menu.general.addInput(this.store, 'seed', {
    min: 0,
    max: 10000,
    step: 1
  })
}

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
    hideNoise: false,
    disableMenu: true,

    // Force to always look in a specific direction
    forceLook: false,
    skipGrow: 1,
    
    // Width of canvas, centered
    width: 0,
    height: 0,
		
		// Use 0 for just one big canvas
    spaces: 2,
  }, getURLParams())

  // ccapture
  if (+params.record) {
    window.capturer = new CCapture({
      format: 'webm',
      framerate: +params.fps,
      verbose: true,
      display: true,
      timeLimit: +params.recordTime
    })
  }

  // Setup seed
  params.seed = _seed = params.seed || floor(fxrand() * 9999999)
  randomSeed(_seed)
  noiseSeed(_seed)
  generateFeatures()
}

/**
 * Shortcut to reseting seeds
 */
function generateFeatures () {
  $fxhashFeatures = {
    centerLayout: random([0, 0, 0, 0, 0, 0, 1, 2, 2]),
    hasJelly: random() > .2,
    isPsychedelic: random() > .8,
    isMonochrome: random() > .85,
    sameCorners: random() > .95
  }
  $fxhashFeatures.hasLashes = $fxhashFeatures.centerLayout === 1 || $fxhashFeatures.centerLayout === 2 && random() > .8

  if ($fxhashFeatures.isMonochrome) {
    monochromeColor = floor(random(7))
  }
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
  _renderer.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2, 'fixed')
  offscreen.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2, 'fixed')
  offscreen2.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2, 'fixed')
  noiseOverlay.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2, 'fixed')
  treeCanvas.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2, 'fixed')
}

/**
 * Sketch entry point
 */
function setup () {
  !params.record && params.fps && frameRate(params.fps)

  let w, h
  w = h = min(windowWidth, windowHeight)
  _strokeWeight = w / 400

  createCanvas(w, h)
  offscreen = createGraphics(w, h)
  offscreen2 = createGraphics(w, h)
  noiseOverlay = createGraphics(w, h)
  treeCanvas = createGraphics(w, h)
  webglCanvas = createGraphics(w, h, WEBGL)
  recenter()

  pixelDensity(1)
  offscreen.pixelDensity(1)
  offscreen2.pixelDensity(1)
  noiseOverlay.pixelDensity(1)
  treeCanvas.pixelDensity(1)
  webglCanvas.pixelDensity(1)

  // Webgl
  cam = webglCanvas.createCamera()
  webglCanvas.ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500)

  setupScene(true)
  mouseX = width / 2
  mouseY = height / 2
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
  // let w = +params.width || windowWidth
  // let h = +params.height || windowHeight
  let w, h
  w = h = min(windowWidth, windowHeight)
  _strokeWeight = w / 400

  resizeCanvas(w, h)
  offscreen.resizeCanvas(width, height)
  offscreen2.resizeCanvas(width, height)
  noiseOverlay.resizeCanvas(width, height)
  treeCanvas.resizeCanvas(width, height)
  setupScene(true)
}

/**
 * Handle keypressed across multiple files
 */
function keyPressed (ev) {
  if (ev.code === 'KeyR') {
    generateFeatures()
    setupScene()
  } else {
    setupScene(true)
  }
}