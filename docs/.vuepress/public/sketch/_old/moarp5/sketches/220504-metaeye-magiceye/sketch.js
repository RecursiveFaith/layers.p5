function setupScene (reset = false) {
  if (reset) {
  }

  // Free data and partition spaces
  Moar.dispose()
  let spaces = new Moar.BinarySpacePartition({
    depth: +params.spaces,
    width: tileSize,
    height: tileSize,
  })

  // If no subdivisions, then make it full screen
  if (+params.spaces === 0) {
    spaces = {partitions: [{
      x: 0,
      y: 0,
      width: tileSize,
      height: tileSize,
      depth: 0
    }]}
  }

  // Loop through each partition and create a moarSpace
  spaces.partitions.forEach(space => {
    // Create the scene
    // We'll also draw the canvas once and save it to speed up fps
    new Moar({
      x: space.x,
      y: space.y,
      width: ceil(space.width),
      height: ceil(space.height),

      onSettings,
      
      store: {
        tileSize,
        
        res: 0,
        field: [],
        numCols: 0,
        numRows: 0,
        cellWidth: 0,
        cellHeight: 0,
        seed: floor(random(10000))
      },

      // Also called whenever a key is pressed or the "Generate" context menu button is clicked
      onSetup (space) {
        randomSeed(space.seed)
        noiseSeed(space.seed)
        space.store.field = []

        // Create THINGS
        let gridSize = ~~random(4, 8)
        let cols = gridSize
        let rows = gridSize
        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            space.addThing({
              shape: 'circle',
              x: x * space.width/cols + space.width/cols/2,
              y: y * space.height/rows + space.height/rows/2,
              size: space.width/(gridSize + .5),
              eyelid: {top: random(.7, .9), bottom: random(.7, .9)}
            })
          }
        }
      }
    })
  })

  // Create the more space to contain the THING for depthmap
  new Moar({
    id: 'depthmap',
    bgColors: ['#000'],
    colors: ['#000', '#fff'],
    onSetup (space) {
      // space.colors = ['#000', '#fff']
      
      space.addThing({
        shape: 'circle',
        iris: {
          color: 1
        },
        eyeWhites: {
          fill: [150, 150, 150]
        },
        pupil: {
          shape: 'circle',
          color: 0,
          size: random(.2, .4),
        },
        x: space.width/2,
        y: space.height/2,
        size: space.width/3,
      })
    },
    onDraw (space, canvas) {
      canvas.background(0)
    }
  })
}

function drawTiles () {
  offscreen2.clear()
  offscreen.clear()

  Moar.spaces.forEach((space, n) => {
    space.draw()

    // Draw into depthmap or tile
    if (space.id === 'depthmap') {
      depthMap.image(space.things[0].canvas, 0, 0, depthMap.width, depthMap.height)
    } else {
      offscreen.image(space.canvas, space.x, space.y)
    }
  })
  
  // Draw the depthmap
  let size = min(depthMap.width, depthMap.height)

  // depthMap.push()
  // depthMap.background(0)
  // depthMap.rectMode(CENTER)
  // depthMap.translate(depthMap.width/2, depthMap.height/2)
  // depthMap.noStroke()
  // depthMap.fill(255)
  // depthMap.circle(0, 0, size/3)
  // depthMap.pop()
  
  // Get depth map data
  let depthData = depthMap.drawingContext.getImageData(0, 0, windowWidth, windowHeight)

  // Draw two blank columns to use for shifting
  for (let i = 0; i < height / tileSize; i++) {
    offscreen2.image(offscreen, 0, i * tileSize)
    offscreen2.image(offscreen, tileSize, i * tileSize)
  }
  let imageData = offscreen2.drawingContext.getImageData(0, 0, windowWidth, windowHeight)

  // Create the austostereogram
  for (let y = 0; y < windowHeight; y++) {
    for (let x = 0; x < windowWidth; x++) {
      let shift = Math.floor(depthData.data[4 * (x + windowWidth * y)] * +params.intensity) - tileSize
      if (0 <= x + shift && x + shift < windowWidth) {
        let offset = (x + windowWidth * y) << 2
        let offsetShift = (x + shift + windowWidth * y) << 2

        imageData.data[offset] = imageData.data[offsetShift]
        imageData.data[offset + 1] = imageData.data[offsetShift + 1]
        imageData.data[offset + 2] = imageData.data[offsetShift + 2]
        imageData.data[offset + 3] = 255
      }
    }
  }

  offscreen2.drawingContext.putImageData(imageData, 0, 0)  

  // generateNoise()
  recenter()
}



/**
 * 🎨 Main draw loop
 */
function draw () {
  drawTiles()
  image(offscreen2, 0, 0)
  const borderHeight = 110
  textAlign(CENTER, CENTER)

  if (width < 900) {
    textSize(20)
  } else {
    textSize(30)
  }

  // Draw the depthmap
  image(depthMap, width - width/6, height - height/6-borderHeight, width/6, height/6)

  // Draw borders
  fill(255, 255, 255, 250)
  rect(0, 0, width, borderHeight)
  rect(0, height-borderHeight, width, borderHeight)

  // Depthmap label
  const labelHeight = 60
  rect(width-width/6, height-height/6-borderHeight-labelHeight, width/6, labelHeight)
  fill(0)

  if (width < 900) {
    text('Map', (width - width/6/2), height-height/6-borderHeight*1.25)
  } else {
    text('Depthmap', (width - width/6/2), height-height/6-borderHeight*1.25)
  }
  
  // Draw helper dots
  push()
  fill(0, 0, 0)
  stroke(255, 255, 255)
  strokeWeight(3)
  circle(width / 2 - 64, 20, 20)
  circle(width / 2 + 64, 20, 20)

  strokeWeight(5)
  text('Relax eyes until 2 dots merge into a 3rd dot', width / 2, 80)
  text('Relax eyes until 2 dots merge into a 3rd dot', width / 2, height - 20)

  strokeWeight(3)
  circle(width / 2 - 64, height - 80, 20)
  circle(width / 2 + 64, height - 80, 20)
  pop()

  // Overlay
  // image(noiseOverlay, 0, 0)
}

