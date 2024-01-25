_strokeWeight = 0

/**
* 🎨 Main draw loop
*/
function draw () {
  // Record
  if (!capturer.__isRecording && +params.record) {
    capturer.__isRecording = true
    capturer.start()
  }
  
  if (frameCount === 3 && typeof fxpreview === 'function') {
    fxpreview()
  }
  
  // Draw spaces
  Moar.draw((space, canvas) => {
    canvas.background(space.bgColors[space.bg])
  })

  // Noise overlay
  image(noiseOverlay, 0, 0)    

  // Record
  if (+params.record) {
    capturer.capture(canvas)
  }  
}

/**
* Create a random set of eyes
*/
function setupScene (reset) {
  if (reset) {
    randomSeed(+params.seed)
    noiseSeed(+params.seed)
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

        let numEyes = [
          random() > .5 ? 1 : 2,
          floor(random(8)),
          floor(random(8, 16)),
          floor(random(16, 32)),
          floor(random(32, 64)),
          floor(random(64, 128)),
          floor(random(128, 256)),
          // floor(random(512, 1024)),
        ]
    
        let size = min(space.width, space.height) / 2.5
        let sizeDiv = 1
        numEyes.forEach(numEyes => {
          let eyeSize = size / sizeDiv / 2
          if (sizeDiv === 1) {
            eyeSize *= random(1, 2.5)
          }
          
          for (let i = 0; i < numEyes; i++) {
            let foundSpot = false
            let x = random(space.width)
            let y = random(space.height)

            let maxLoops = 100
            let numLoops = 0

            while (!foundSpot || (!foundSpot && numLoops++ < maxLoops)) {
              x = random(space.width)
              y = random(space.height)
              
              foundSpot = true
              for (let n = 0; n < space.things.length; n++) {
                let d = dist(x, y, space.things[n].x, space.things[n].y) - eyeSize - space.things[n].size/2
                if (d < 0) {
                  foundSpot = false
                  break
                }
              }
            }

            // Create the thing 👁️
            space.addThing({
              x,
              y,
              size: eyeSize,
              shape: 'circle',
              onClick: (clickedThing) => {
                // Sort things by distance from the clicked thing
                // space.things.sort((a, b) => {
                //   let d1 = dist(thing.x, thing.y, a.x, a.y)
                //   let d2 = dist(thing.x, thing.y, b.x, b.y)
                //   return d1 - d2
                // })
                
                // Blink things
                space.things.forEach(thing => {
                  let blinkSpeed = space.width / params.fps/2
                  thing.curBlink = 0
                  thing.blinkTimer = (dist(clickedThing.x, clickedThing.y, thing.x, thing.y) - clickedThing.size/2 ) / blinkSpeed
                })
              }
            })
          }

          sizeDiv *= 1.5
        })
      }
    })
  })
  
  generateNoise()
  recenter()
}