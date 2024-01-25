// The size everything is scaled to
const planetSize = 500
const ringRadius = planetSize / 2 - planetSize/16
const ringTorusRadius = ringRadius*3
const ringTorusCenter = planetSize*2.8

/**
 * Called on keypress/resize
 */
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
        bg1: random([6]),
        bg2: 0,
        hasEyes: false,
        seed: +params.seed,
        ringsStart: random(-HALF_PI/8, HALF_PI/4),
        ringsEnd: random(HALF_PI/4+HALF_PI/6, HALF_PI),
        cam: {
          deltaTheta: random(0, .35),
          deltaPhi: random(-.5, 0),
          deltaZ: random(400, 1000),
          x: 0,
          y: 0,
          z: random(300, 1000)
        },
        planetX: floor(random(3, 13)),
        planetY: floor(random(3, 5)),
        ringX: floor(random(6, 13)),
        ringY: floor(random(6, 13)),
        rocks: []
      },

      // Also called whenever a key is pressed or the "Generate" context menu button is clicked
      onSetup (space) {
        for (let i = 0; i < random(300, 1000); i++) {
          let angle = random(-PI, PI)
          
          space.store.rocks.push({
            x: cos(angle) * (ringTorusCenter + random(-ringTorusRadius, ringTorusRadius)),
            y: sin(angle) * (ringTorusCenter + random(-ringTorusRadius, ringTorusRadius)),
            z: random(-ringTorusRadius * .7, ringTorusRadius * .7),
            angle: angle,
            rot: 0,
            rotSpeed: random(-1, 1) / 20,
            rotAxis: random(['rotateX', 'rotateY', 'rotateZ']),

            rotX: random(-HALF_PI, HALF_PI),
            rotY: random(-HALF_PI, HALF_PI),
            rotZ: random(-HALF_PI, HALF_PI),
            color: floor(random(6)),
            size: random(.5, 1.5),
            detail: floor(random(3, 6))
          })
        }
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
    const camPos = createVector(space.store.cam.x, space.store.cam.y, space.store.cam.z)

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
      if (y < space.height/h/6 - 1 || y > space.height/h*5/6) {
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
    offscreen.resizeCanvas(planetSize, planetSize)
    // offscreen.resizeCanvas(space.height, space.height)
    offscreen.noFill()
    offscreen.colorMode(...space.colorMode)

    let numStripes = 10
    let stripeWidth = ringRadius / numStripes
    let startA = space.store.ringsStart// - sin(TWO_PI * Moar.getProgress(8)) * HALF_PI/3
    let endA = space.store.ringsEnd// + sin(TWO_PI * Moar.getProgress(8)) * HALF_PI/3

    offscreen.push()
    offscreen.strokeWeight(stripeWidth+1)
    offscreen.translate(planetSize/2, planetSize/2)
    for (let i = 0; i < numStripes; i++) {
      let c = Moar.wrap(i - floor(frameCount/5), 0, space.bgColors.length-1)
      offscreen.stroke(space.bgColors[c])
      offscreen.beginShape()
      for (let j = startA-HALF_PI; j < endA-HALF_PI; j += HALF_PI/16) {
        offscreen.vertex(cos(j) * (ringRadius-i*stripeWidth*.5), sin(j) * (ringRadius-i*stripeWidth*.5))
      }
      offscreen.endShape()
    }
    offscreen.pop()
    
    // 3D
    glc.clear()
    glc.resizeCanvas(canvas.width, canvas.height)

    // Position the camera
    cam.setPosition(camPos.x, camPos.z, camPos.z)
    cam.lookAt(0, 0, 0)
    cam._orbit(space.store.cam.deltaTheta, space.store.cam.deltaPhi, space.store.cam.deltaZ)

    // Planet
    glc.stroke(0)
    glc.push()
    glc.translate(-planetSize, planetSize, 0)
    glc.rotateX(HALF_PI)
    glc.rotateY(TWO_PI * Moar.getProgress(32))
    glc.sphere(planetSize, space.store.planetX, space.store.planetY)
    glc.pop()

    // Rings (Behind rainbow)
    glc.strokeWeight(1)
    glc.stroke(color(0, 0, 0))
    glc.fill(255, 255, 255)

    glc.push()
    glc.translate(-planetSize, planetSize, 0)
    glc.rotateZ(startA)
    glc.translate(0, -ringTorusCenter, 0)
    glc.rotateY(-HALF_PI)
    glc.rotateZ(-Moar.getProgress(8) * TWO_PI)
    glc.torus(ringTorusRadius, 16, space.store.ringX, space.store.ringY)
    glc.pop()

    glc.push()
    glc.translate(-planetSize, planetSize, 0)
    glc.rotateZ(endA)
    glc.translate(0, -ringTorusCenter, 0)
    glc.rotateY(-HALF_PI)
    glc.rotateZ(-Moar.getProgress(8) * TWO_PI)
    glc.torus(ringTorusRadius, 16, space.store.ringX, space.store.ringY)
    glc.pop()

    // Rocks
    glc.colorMode(...space.colorMode)
    space.store.rocks.forEach(rock => {
      rock.rot += rock.rotSpeed

      if (!(rock.angle > startA-HALF_PI/12 && rock.angle < endA+HALF_PI/12)) {
        glc.push()
        glc.translate(-planetSize, planetSize, 0)
        glc.rotateZ(-HALF_PI)
        glc.translate(rock.x, rock.y, rock.z)
        glc.rotateX(rock.rotX)
        glc.rotateY(rock.rotY)
        glc.rotateZ(rock.rotZ)
        glc[rock.rotAxis](Moar.getProgress(8) * TWO_PI)
        glc.fill(space.colors[rock.color])
        glc.sphere(planetSize / 20 * rock.size, rock.detail, rock.detail)
        glc.pop()
      }
    })

    // Rainbow
    glc.noStroke()
    glc.push()
    glc.texture(offscreen)
    glc.translate(-planetSize, planetSize, 0)
    glc.plane(planetSize*8, planetSize*8)
    glc.pop()

    canvas.image(webglCanvas, 0, 0)
  })
  
  // Overlay
  // image(noiseOverlay, 0, 0)

  // Record
  if (+params.record) {
    capturer.capture(document.querySelector('#defaultCanvas0'))
  } 
}

/**
 * Manual Orbit Controls
 * @see https://stackoverflow.com/a/69006472
 */
function mouseDragged () {
  const sensitivityX = 1
  const sensitivityY = 0.5
  const scaleFactor = 100

  // Determine clicked canvas
  // Only drag if mouse isn't over menu
  // @fixme Optimize by breaking loop after finding canvas
  Moar.spaces.forEach(space => {
    if (space.menu) {
      const $div = space.menu.containerElem_
      const rect = $div.getBoundingClientRect()

      if (mouseX > rect.left && mouseX < rect.right && mouseY > rect.top && mouseY < rect.bottom) {
        return
      }
    }
    
    if (mouseX > space.x && mouseX < space.x + space.width && mouseY > space.y && mouseY < space.y + space.height) {
      space.store.cam.deltaTheta += (-sensitivityX * (mouseX - pmouseX)) / scaleFactor
      space.store.cam.deltaPhi += (sensitivityY * (mouseY - pmouseY)) / scaleFactor
    }
  })
}

// @todo Implment mouseWheel zooming
function mouseWheel (ev) {
  // Determine zoomed canvas
  // @fixme Optimize by breaking loop after finding canvas
  Moar.spaces.forEach(space => {
    if (mouseX > space.x && mouseX < space.x + space.width && mouseY > space.y && mouseY < space.y + space.height) {
      if (ev.delta > 0) {
        space.store.cam.deltaZ += 1 * 200
      } else {
        space.store.cam.deltaZ -= 1 * 200
      }
      // Moar.spaces[0].store.cam.deltaZ = max(min(Moar.spaces[0].store.cam.deltaZ, 160), -80)
    }
  })
}