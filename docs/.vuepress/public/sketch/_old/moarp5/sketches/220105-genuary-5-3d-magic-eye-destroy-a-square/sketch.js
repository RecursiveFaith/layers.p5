function setupScene (reset = false) {
  if (reset) {
  }

  // Free data and partition spaces
  Moar.dispose()
  offscreen2.clear()
  offscreen.clear()
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
        gridRes: random(0.005, 0.1),
        isMonochrome: random([true, false]),
        lineWidth: floor(random(1, 10)),
        lineLen: random(2, 40),

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
        
        // Setup flow field grid
        let x = space.width * -.5
        let xx = space.width * 1.5
        let y = space.height * -.5
        let yy = space.height * 1.5
        let res = space.store.res = space.width * space.store.gridRes

        let xSign = random([-1, 1])
        let ySign = random([-1, 1])
        
        space.store.numCols = (xx - x) / res
        space.store.numRows = (yy - y) / res
        space.store.cellWidth = (xx - x) / space.store.numCols
        space.store.cellHeight = (yy - y) / space.store.numRows

        for (let x = 0; x < space.store.numCols; x++) {
          space.store.field.push([])
          for (let y = 0; y < space.store.numRows; y++) {
            let angle = (y*ySign / space.store.numRows + x*xSign / space.store.numCols) * TWO_PI
            space.store.field[x].push({
              angle: angle,
              color: space.bgColors[space.randomFG()],
              len: random(space.store.lineLen),
              lineWidth: random(space.store.lineWidth)
            })
          }
        }
        space.background()
    
        // Draw the flow field
        space.store.field.forEach((row, x) => {
          row.forEach((cell, y) => {
            space.canvas.strokeWeight(cell.lineWidth)
            space.canvas.stroke(cell.color)
            space.canvas.push()
            space.canvas.translate(x * (space.store.cellWidth), y * (space.store.cellHeight))
            space.canvas.rotate(cell.angle)
            space.canvas.line(0, -cell.len/2, 0, cell.len/2)
            space.canvas.pop()
          })
        })

        offscreen.image(space.canvas, space.x, space.y)
      }
    })
  })

  // Draw the depthmap
  let size = min(depthMap.width, depthMap.height)
  
  depthMap.push()
  depthMap.background(0)
  depthMap.rectMode(CENTER)
  depthMap.translate(depthMap.width/2, depthMap.height/2)
  depthMap.noStroke()
  depthMap.fill(255)
  depthMap.rect(0, 0, size/3, size/3)
  depthMap.pop()
  
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

  generateNoise()
  recenter()
}



/**
 * 🎨 Main draw loop
 */
function draw () {
  image(offscreen2, 0, 0)

  // Draw the depthmap
  image(depthMap, width - width/4, height - height/4, width/4, height/4)

  // Draw helper dots
  push()
  fill(0, 0, 0)
  stroke(255, 255, 255)
  strokeWeight(3)
  circle(width / 2 - 64, 20, 20)
  circle(width / 2 + 64, 20, 20)

  textSize(30)
  strokeWeight(5)
  textAlign(CENTER, CENTER)
  text('Relax eyes until 2 dots merge into a 3rd dot', width / 2, 80)
  text('Relax eyes until 2 dots merge into a 3rd dot', width / 2, height - 20)

  strokeWeight(3)
  circle(width / 2 - 64, height - 80, 20)
  circle(width / 2 + 64, height - 80, 20)
  pop()

  // Overlay
  // image(noiseOverlay, 0, 0)
}

