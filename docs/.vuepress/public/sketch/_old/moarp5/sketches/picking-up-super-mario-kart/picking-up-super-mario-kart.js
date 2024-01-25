
function setupScene () {
  Moar.dispose()
  let space = new Moar.BinarySpacePartition({
    depth: +params.maxPartitionDepth
  })

  // If no subdivisions, then make it full screen
  if (+params.maxPartitionDepth === 0) {
    space = {partitions: [{
      x: 0,
      y: 0,
      width,
      height,
      depth: 0
    }]}
  }
    
  // Loop through each partition and create a moarSpace
  space.partitions.forEach(space => {
    // Create the scene
    new Moar({
      x: space.x,
      y: space.y,
      width: ceil(space.width),
      height: ceil(space.height),

      store: {
        variability: random(3, 6),
        numClones: random(10, 100),
        sphere: {
          x: floor(random(3, 12)),
          y: floor(random(3, 12))
        },
        cam: {
          deltaTheta: 0,
          deltaPhi: 0
        },
        wireframe: {
          thickness: random(1, 10),
          opacity: floor(random(5) * 255/5)
        }
      },

      // Custom menu items
      onSettings (menu) {
      },

      // Also called whenever a key is pressed or the "Generate" context menu button is clicked
      onSetup (moar) {
        // Create an array that contains the frames to loop over
        gifSkateboardFrames = []
        let frameIndex = 0
        for (let i = 0; i < gifSkateboard.numFrames() * 2 - 1; i++) {
          gifSkateboardFrames.push(frameIndex)
          if (i < gifSkateboard.numFrames() - 1) {
            ++frameIndex
          } else {
            --frameIndex
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
  const glc = webglCanvas
  
  // Pacemaker (not used yet)
  progress = Moar.getProgress(+params.loop || 9)

  // Render each space sperately and draw moarThings (eyes and other basic shapes)
  Moar.draw((moar, canvas) => {
    moar.background()

    // Checkered pattern
    canvas.noStroke()
    let count = 0
    let columns = 20
    let w = moar.width / columns
    let h = w

    for (let y = floor(moar.height / h / 1.25); y < moar.height / h + 2; y ++) {
      for (let x = 0; x < columns + 4; x++) {
        let xShift = w * 2 * Moar.getProgress(9/9) * 2
        
        if ((++count + y) % 2 === 0) {
          canvas.fill(255)
        } else {
          canvas.fill(0)
        }

        canvas.rect(w * x - xShift, y * h, w, h)
      }
    }

    // Rainbow pattern
    let numStripes = moar.colors.length * 2
    let stripeWidth = moar.height / 60

    canvas.noStroke()
    canvas.strokeWeight(stripeWidth)
    for (let n = 0; n < numStripes; n++) {
      let color = [...moar.colors[Moar.wrap(n - floor(moar.colors.length * progress * -6), 0, moar.colors.length)]]
      canvas.stroke(color)
      canvas.noFill()
      canvas.beginShape()
      for (let x = 0; x < moar.width + stripeWidth * 2; x += stripeWidth) {
        canvas.vertex(x, n * stripeWidth + moar.height - moar.height / 3 + noise(x - frameCount * .02) * stripeWidth * 3)
      }
      canvas.endShape()
    }

    // Draw the skateboard
    const frame = floor(frameCount % gifSkateboardFrames.length)
    gifSkateboard.setFrame(gifSkateboardFrames[frame])
    canvas.image(gifSkateboard, -moar.width / 20, 0, canvas.width, canvas.height)
  })

  // Overlay
  image(noiseOverlay, 0, 0)
}
