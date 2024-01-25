
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
		
		// Use 0 for just one big canvas
    maxPartitionDepth: 0,
  }, getURLParams())

  gifSkateboard = loadImage('./public/img/skateboard.gif')
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
  const gl = webglCanvas._renderer.GL
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  setupScene()
}

/**
 * Tap with two fingers to recreate sketch
 */
function touchStarted () {
  if (touches.length > 1) {
    setupScene()
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
  setupScene(true)
}

/**
 * Handle keypressed across multiple files
 */
function keyPressed () {
  frameCount = 0
  setupScene()
}