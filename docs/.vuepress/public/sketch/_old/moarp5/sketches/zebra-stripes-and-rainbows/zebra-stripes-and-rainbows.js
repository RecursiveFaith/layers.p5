
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
    animate: 1
  }, getURLParams())

  // ccapture
  if (params.record) {
    const framerate = +params.fps
    window.capturer = new CCapture({
      format: 'webm',
      framerate,
      verbose: true,
      display: true,
      timeLimit: +params.loop || +params.record,
      autoSaveTime: 120
    })
  }
}

/**
 * 🎨 Main draw loop
 */
function draw () {
  if (frameCount === 1 && params.record) {
    capturer.start()
  }
  progress = Moar.getProgress(+params.loop)

  // Render each space sperately
  moar.draw((moar, canvas) => {
    // moar.background()

    canvas.push()
    canvas.translate(width/2, height/2)

    canvas.noStroke()

    for (let i = 0; i < moar.store.hexes.length; i++) {
      let loc = Moar.HexGrid.hex2Screen(moar.store.hex.layout, moar.store.hexes[i])
      let coord = Moar.HexGrid.hexGetCoord(moar.store.hexes[i])
      let height
      let colors = [...moar.colors]
      let res = 1/moar.store.resolution

      // Shuffle the colors
      if (moar.bg) {
        for (let i = 0; i < moar.bg; i++) {
          colors.push(colors.shift())
        }
      }

      // Add stripes
      for (let n = 0; n < moar.store.numStripes; n++) {
        colors.push(n % 2 ? 255 : 0)
      }

      // Get the height of the cell based on noise and looping state
      if (+params.loop) {
        let z = noise(cos(TWO_PI * progress) * .5 + 100, sin(TWO_PI * progress) * .5 + 100)
        height = noise(loc.x * res + moar.store.offset.x / 1000, loc.y * res + 100 + moar.store.offset.y / 1000, z)
      } else {
        if (+params.animate) {
          height = noise(loc.x * res + moar.store.offset.x / 1000, loc.y * res + 100 + moar.store.offset.y / 1000, frameCount / 500)
        } else {
          // height = noise(loc.x * this.store.hexSize + 100, loc.y * this.store.hexSize + 100)
          height = noise(loc.x * res + moar.store.offset.x / 1000, loc.y * res + moar.store.offset.y / 1000)
        }
      }
      let adjust = 0
      let c
      
      // remove 3rd index from colors
      colors.splice(3, 1)
      c = colors[floor(height * 40) % colors.length]
      Moar.HexGrid.hexDraw(moar.store.hex.layout, moar.store.hexes[i], canvas.color(c), canvas)
    }
    canvas.pop()
  })  

  // Overlay
  image(noiseOverlay, 0, 0)
  if (params.record) {
    capturer.capture(canvas)
  }
}

function hexInArray (hex, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (hexIsEquals(hex, arr[i])) return true
  }
  return false
}

/**
 * Setup scene
 */
function setupScene () {
  Moar.dispose()

  // Create the scene
  moar = new Moar({
    bg: 0,

    onSettings (menu) {
      console.log(menu)
    },

    // Custom settings
    store: {
      resolution: 500,
      numStripes: 10,
      offset: {
        x: 0,
        y: 0
      },
      hexSize: 8
    },

    // Custom menu items
    onSettings (menu) {
      menu.general.addInput(this.store, 'resolution', {
        min: 1,
        max: 2000,
        step: 1
      })
      menu.general.addInput(this.store, 'numStripes', {
        min: 0,
        max: 20,
        step: 1
      })
      menu.general.addInput(this.store, 'hexSize', {
        min: 3,
        max: floor(max(width, height) / 10),
        step: 1
      }).on('change', () => {
        this.tmp.relayoutHex()
      })
      menu.general.addInput(this.store, 'offset', {
        picker: 'inline',
        expanded: true,
        x: {min: -moar.width * 10, max: moar.width * 10, step: 1},
        y: {min: -moar.height * 10, max: moar.height * 10, step: 1}
      })
    },
    
    // Called whenever the "Generate" context menu button is clicked
    onSetup (moar) {
      noiseSeed(floor(random() * 100000))

      // Update
      this.tmp.relayoutHex = () => {
        this.store.hex = {pointSize: Moar.HexGrid.Point(this.store.hexSize, this.store.hexSize)}
        this.store.hexes = []
        this.store.hex.layout = Moar.HexGrid.hexLayout(Moar.HexGrid.pointyOrient, this.store.hex.pointSize)
        let radius = ceil(max(moar.width, moar.height) / this.store.hexSize / 2)
        Moar.HexGrid.hexGenerateBoard(radius, this.store.hexes)
      }
      this.tmp.relayoutHex()
    }
  })

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
  horizonCanvas = createGraphics(width, height)

  pixelDensity(1)
  offscreen.pixelDensity(1)
  noiseOverlay.pixelDensity(1)
  treeCanvas.pixelDensity(1)
  horizonCanvas.pixelDensity(1)

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
  horizonCanvas.resizeCanvas(width, height)
  setupScene(true)
}

/**
 * Handle keypressed across multiple files
 */
function keyPressed () {
  frameCount = 0
  setupScene()
}