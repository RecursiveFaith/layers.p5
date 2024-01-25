
function setupScene (reset = false) {
  let w = +params.width || windowWidth
  let h = +params.height || windowHeight

  resizeCanvas(w, h)
  offscreen.resizeCanvas(width, height)
  noiseOverlay.resizeCanvas(width, height)
  treeCanvas.resizeCanvas(width, height)
  
  if (reset) {
  }

  // Free data and partition spaces
  Moar.dispose()
  let depth = random() > .25 ? +params.spaces : floor(random(+params.spaces))
  let spaces = new Moar.BinarySpacePartition({
    depth: depth
  })

  // If no subdivisions, then make it full screen
  if (+params.spaces === 0 || depth === 0) {
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
        bg: 0,
        bg1: floor(random(7)),
        bg2: 0,
        hasEyes: false,
        seed: +params.seed,
        cam: {
          deltaTheta: 0,
          deltaPhi: random(-1, -.15),
          deltaZ: -1.5
        },
      },

      // Also called whenever a key is pressed or the "Generate" context menu button is clicked
      onSetup (space) {
      }
    })
  })

  generateNoise()
  recenter()

  setTimeout(() => {
  }, 100)
}



/**
 * 🎨 Main draw loop
 */
function draw () {
  // Record
  if (frameCount === 10 && +params.record) {
    capturer.start()
  }
  
  const glc = webglCanvas

  // Render each space sperately and draw moarThings (eyes and other basic shapes)
  Moar.draw((space, canvas) => {
    const lookAt = createVector(0, 0, -1000)
    const camPos = createVector(sin(TWO_PI * Moar.getProgress(3)) * -10, space.store.cam.y, sin(TWO_PI * Moar.getProgress(3)) * -10 - space.store.cam.z)
    const camDir = lookAt.copy().sub(camPos)

		// First paint the background
    canvas.background(space.bgColors[space.store.bg1])
    // Checkered pattern
    canvas.noStroke()
    let count = 0
    let columns = 20
    if (windowWidth < 400) {
      columns = 8
    } else if (windowWidth < 800) {
      columns = 20
    } else if (windowWidth < 1600) {
      columns = 40
    } else {
      columns = 60
    }
    let w = space.width / columns
    let h = w
    
    for (let y = 0; y < space.height/h; y++) {
      if (y < space.height/h/4 - 1 || y > space.height/h*3/4) {
        for (let x = -4; x < columns + 4; x++) {
          let xShift = w * 2 * Moar.getProgress(4) * 2
          let dir = y > space.height/h/2 ? 1 : -1
          xShift *= dir
          
          if ((++count + y) % 2 === 0) {
            canvas.fill(255)
          } else {
            canvas.fill(0)
          }

          canvas.rect(w * x - xShift, y * h, w, h)
        }
      }
    }

    // Rainbow pattern
    offscreen.clear()
    offscreen.resizeCanvas(space.height, space.height)
    offscreen.noFill()
    offscreen.colorMode(...space.colorMode)

    let numStripes = 10
    let stripeWidth = space.height/2 / numStripes
    let r = space.height * .9

    offscreen.push()
    offscreen.strokeWeight(stripeWidth+1)
    offscreen.translate(0, canvas.height*5/4)
    for (let i = 0; i < numStripes; i++) {
      let c = Moar.wrap(i - floor(frameCount/5), 0, space.bgColors.length-1)
      offscreen.stroke(space.bgColors[c])
      offscreen.beginShape()
      let n = 0
      for (let j = -HALF_PI; j < HALF_PI; j += HALF_PI/16) {
        offscreen.vertex(cos(j) * (r-i*stripeWidth), sin(j) * (r-i*stripeWidth))
        n++
      }
      offscreen.endShape()
    }
    offscreen.pop()
    
    // 3D
    glc.clear()
    glc.resizeCanvas(canvas.width, canvas.height)

    // Rings (Behind rainbow)
    glc.strokeWeight(1)
    glc.stroke(color(0, 0, 0))
    glc.fill(255, 255, 255)

    glc.push()
    glc.translate(-150, -80, 0)
    glc.rotateX(-1.5)
    glc.rotateY(1)
    glc.rotateZ(-Moar.getProgress(8) * TWO_PI)
    glc.torus(300, 16, 10, 6)
    glc.pop()

    glc.push()
    glc.translate(100, 180, 100)
    glc.rotateX(HALF_PI)
    glc.rotateZ(Moar.getProgress(8) * TWO_PI)
    glc.torus(300, 16, 10, 6)
    glc.pop()

    // Rainbow
    // glc.noStroke()
    glc.push()
    glc.texture(offscreen)
    glc.translate(40, -200, 0)
    glc.rotateY(-.45)
    glc.plane(800, 800)
    glc.pop()

    // Rings (in front of rainbow)
    glc.strokeWeight(1)
    glc.stroke(color(0, 0, 0))
    glc.fill(255, 255, 255)

    glc.push()
    glc.translate(-150, -80, 0)
    glc.rotateX(-1.5)
    glc.rotateY(1)
    glc.rotateZ(-Moar.getProgress(8) * TWO_PI)
    glc.torus(300, 16, 10, 6)
    glc.pop()

    glc.push()
    glc.translate(100, 180, 100)
    glc.rotateX(HALF_PI)
    glc.rotateZ(Moar.getProgress(8) * TWO_PI)
    glc.torus(300, 16, 10, 6)
    glc.pop()

    canvas.image(webglCanvas, 0, 0)
  })
  
  // Overlay
  //image(noiseOverlay, 0, 0)

  // Record
  if (+params.record) {
    capturer.capture(document.querySelector('#defaultCanvas0'))
  } 
}

