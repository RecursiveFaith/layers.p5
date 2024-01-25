
let gifFrames, gifRatio
// The center pixel of the trumpet for each frame
let gifOrigin = [
  272, 54,
  270, 53,
  269, 50,
  265, 52,
  264, 58,
  258, 69,
  252, 65,
  254, 64,
  240, 59,
  239, 61,
  239, 65,
  240, 76,
  240, 83,
  239, 85,
  239, 83,
  240, 84,
  243, 84,
  247, 88,
  253, 89,
  262, 99,
  267, 107,
  274, 114,
  279, 120,
  282, 122,
  285, 123,
  287, 124,
  286, 124,
  289, 124,
  289, 123,
  289, 122,
  288, 121,
]
let dancers = ['💃', '🕺']

function setupScene () {
  // Free data and partition spaces
  Moar.dispose()
  let space = new Moar.BinarySpacePartition({
    depth: +params.spaces,
    width: windowWidth,
    height: windowHeight
  })

  // If no subdivisions, then make it full screen
  if (+params.spaces === 0) {
    space = {partitions: [{
      x: 0,
      y: 0,
      width: windowWidth,
      height,
      depth: 0
    }]}
  }
    
  // Loop through each partition and create a moarSpace
  space.partitions.forEach(space => {
    // Create the scene
    main = new Moar({
      x: space.x,
      y: space.y,
      width: ceil(space.width),
      height: ceil(space.height),

      store: {
        emojis: []
      },

      // Create emojis
      onSetup () {
        this.store.emojis = []
        for (let i = 0; i < random(8, 32); i++) {
          this.store.emojis.push(random(dancers))
        }
      }
    })
  })

  // Create an array that contains the frames to loop over
  gifFrames = []
  let frameIndex = 0
  for (let i = 0; i < gif.numFrames() * 2 - 1; i++) {
    gifFrames.push(frameIndex)
    if (i < gif.numFrames() - 1) {
      ++frameIndex
    } else {
      --frameIndex
    }
  }
  
  generateNoise()
  recenter()
}



/**
 * 🎨 Main draw loop
 */
function draw () {
  // Record
  if (frameCount === 1 && +params.record) {
    capturer.start()
  }
  
  // Pacemaker
  progress = Moar.getProgress(4)

  // Render each space sperately and draw moarThings (eyes and other basic shapes)
  Moar.draw((moar, canvas) => {
    let gifWidth = moar.width / 2
    let gifHeight = moar.height / 2 * gifRatio
    moar.background()

    // Draw the GIF
    const frame = floor(gifFrames.length * progress)
    gif.setFrame(gifFrames[frame])
    canvas.image(gif, -moar.width / 30, 0, gifWidth, gifHeight)
    
    // Checkered pattern
    canvas.noStroke()
    let count = 0
    let columns = 20
    let w = moar.width / columns
    let h = w
    
    for (let y = floor(gifHeight/h); y < moar.height/h + 2; y++) {
      for (let x = 0; x < columns + 4; x++) {
        let xShift = w * 2 * Moar.getProgress(4) * 2
        
        if ((++count + y) % 2 === 0) {
          canvas.fill(255)
        } else {
          canvas.fill(0)
        }

        canvas.rect(w * x - xShift, y * h, w, h)
      }
    }

    // Rainbow pattern
    canvas.noStroke()

    let numStripes = moar.colors.length * 3
    let step = 90 / numStripes
    let orig = {
      x: moar.width * -.035,
      y: moar.height * .001
    }
    let n = 0
    let r = moar.width * 2

    for (let i = 30; i > -60; i -= step) {
      let color = [...moar.colors[Moar.wrap(n, 0, moar.colors.length)]]
      canvas.fill(color)
      n++
      
      // Get the gifOrigin
      let actualFrame
      if (frame < gifFrames.length / 2) {
        actualFrame = frame
      } else {
        actualFrame = abs(frame - gifFrames.length)
      }
      
      let xOff = (gifOrigin[actualFrame * 2]) * (gifWidth / gif.width)
      let yOff = (gifOrigin[actualFrame * 2 + 1]) * (gifHeight / gif.height)

      // Create a jiggly triangle
      let segLength = r / 20
      
      canvas.beginShape()
      canvas.vertex(orig.x + xOff, orig.y + yOff)
      canvas.vertex(orig.x + xOff, orig.y + yOff)
      for (let j = 1; j < segLength; j++) {
        canvas.curveVertex(
          orig.x + xOff + cos(radians(i)) * (j * segLength),
          orig.y + yOff + sin(radians(i)) * (j * segLength) - noise(j - frameCount * .1) * moar.height/10
        )
      }
      for (let j = segLength; j > 1; j--) {
        canvas.curveVertex(
          orig.x + xOff + cos(radians(i + step)) * (j * segLength),
          orig.y + yOff + sin(radians(i + step)) * (j * segLength) + noise(j - frameCount * .1) * moar.height/10
        )
      }
      canvas.vertex(orig.x + xOff, orig.y + yOff)
      canvas.vertex(orig.x + xOff, orig.y + yOff)
      canvas.endShape()
    }
  })

  // Overlay
  image(noiseOverlay, 0, 0)

  // Record
  if (+params.record) {
    capturer.capture(canvas)
  }
}
