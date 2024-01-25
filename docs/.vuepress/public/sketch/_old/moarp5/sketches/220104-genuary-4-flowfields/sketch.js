
function setupScene (reset = false) {
  if (reset) {
  }

  // Free data and partition spaces
  Moar.dispose()
  let spaces = new Moar.BinarySpacePartition({
    depth: +params.spaces
  })

  // If no subdivisions, then make it full screen
  if (+params.spaces === 0) {
    spaces = {partitions: [{
      x: 0,
      y: 0,
      width,
      height,
      depth: 0
    }]}
  }
    
  // Loop through each partition and create a moarSpace
  spaces.partitions.forEach(space => {
    // Create the scene
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
      }
    })
  })

  generateNoise()
  recenter()
}



/**
 * 🎨 Main draw loop
 */
function draw () {
  // Render each space sperately and draw moarThings (eyes and other basic shapes)
  Moar.draw((space, canvas) => {
    space.background()

    space.store.field.forEach((row, x) => {
      row.forEach((cell, y) => {
        canvas.strokeWeight(cell.lineWidth)
        canvas.stroke(cell.color)
        canvas.push()
        canvas.translate(x * (space.store.cellWidth), y * (space.store.cellHeight))
        canvas.rotate(cell.angle)
        canvas.line(0, -cell.len/2, 0, cell.len/2)
        canvas.pop()
      })
    })
  })
  
  // Overlay
  image(noiseOverlay, 0, 0)
}

