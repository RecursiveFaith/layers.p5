
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
    seed: null,
    animate: 1,
		// Use 0 for just one big canvas, or n to subdivide by that amount
    spaces: 1,
  }, getURLParams())

  if (params.seed) {
    randomSeed(+params.seed)
    noiseSeed(+params.seed)
  }

  gif = loadImage('./public/img/louis-armstrong.gif')
  gifRatio = gif.width / gif.height
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
  webglCanvas.position(width / 2 - width / 2, height / 2 - height / 2, 'fixed')
}  

/**
 * Sketch entry point
 */
 function setup () {
  !params.record && params.fps && frameRate(params.fps)

  // Create canvases
  createCanvas(windowWidth, windowHeight)
  offscreen = createGraphics(width, height)
  noiseOverlay = createGraphics(width, height)
  webglCanvas = createGraphics(width, height, WEBGL)

  // Set pixel densities
  pixelDensity(1)
  offscreen.pixelDensity(1)
  noiseOverlay.pixelDensity(1)
  webglCanvas.pixelDensity(1)

  // Recording
  if (+params.record || +params.loop) {
    w = +params.recordWidth
    h = +params.recordHeight
  }
  if (+params.record) {
    window.capturer = new CCapture({
      format: 'webm',
      framerate: +params.fps,
      verbose: true,
      display: true,
      timeLimit: +params.recordTime
    })
  }

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
  webglCanvas.resizeCanvas(width, height)
  setupScene()
}

/**
 * Handle keypressed across multiple files
 */
function keyPressed () {
  setupScene(true)
}