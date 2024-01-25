treeScale = 3

function setupScene (reset = false) {
  if (reset) {
    // Shuffle settings
    NumTrees = floor(random(24, 56))
    EyeDensity = floor(random(50))
    Position = floor(random(0, 9))
    Terrarium = floor(random(3, 9))
    Background = floor(random(5))
    BGColor = floor(random(7))
    BGColor2 = random() > .75 ? floor(random(7)) : BGColor
    FrameWidth = random() > .9 ? 0 : floor(random(1, 12))
    FrameOpacity = random() > .9 ? 0 : floor(random(2, 6)) * 55
    TreeColor1 = floor(random(7))
    TreeColor2 = BGColor

    if (Background === 3 && BGColor === BGColor2 && random() > .25) {
      while (BGColor !== BGColor2) {
        BGColor2 = floor(random(7))
      }
    }

    if (FrameOpacity === 0) {
      FrameWidth = 0
    }

    lastTreeColor1 = TreeColor1
    lastTreeColor2 = TreeColor2
    lastNumTrees = NumTrees
    lastPosition = Position

    Seed = floor(random(100000))

    // Pick a different foreground color
    while (true) {
      let c = floor(random(6))
      if (c !== BGColor) {
        TreeColor1 = c
        break
      }
    }
  }

  // Free data and partition spaces
  Moar.dispose()
  let space = new Moar.BinarySpacePartition({
    depth: +params.spaces
  })

  // If no subdivisions, then make it full screen
  if (+params.spaces === 0) {
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
        cam: {
          deltaTheta: 0,
          deltaPhi: random(-1, -.15),
          deltaZ: -1.5
        },
        
        NumTrees,
        EyeDensity,
        Terrarium,
        FrameWidth,
        FrameOpacity,
        Background,
        BGColor,
        BGColor2,
        TreeColor1,
        TreeColor2,
        Position,
        Seed
      },

      // Custom menu items
      onSettings,

      // Also called whenever a key is pressed or the "Generate" context menu button is clicked
      onSetup (moar) {
        randomSeed(Seed)
        noiseSeed(Seed)
    
				// Reset store
        this.store.trees = []
        this.store.treeClones = []
        this.store.cam.x = 100
        this.store.cam.y = random(-200, -40)
        this.store.cam.z = random(240, 350)

        // Number of unique trees
        let numBuddies = 1
        if (random() > .75) {
          numBuddies = floor(random(2, 4))
        }

        // Get the pixels we can place trees on
        let scale = 1
        let rot = 0
        switch (Terrarium) {
          case 3:
            rot = PI/2
            scale = .85
          break
          case 4:
            scale = .85
          break
          case 5:
            rot = PI/2
            scale = .9
          break
          case 6:
            rot = PI/2
            scale = .9
          break
          case 7:
            rot = PI/2
            scale = .9
          break
          case 8:
            rot = PI/2
            scale = .9
          break
        }
        scale = scale * .9
        
        offscreen.push()
        offscreen.clear()
        offscreen.noStroke()
        offscreen.fill(255)
        offscreen.translate(sphereRadius, sphereRadius)
        offscreen.rotate(rot)
        Moar.shape.polygon(offscreen, sphereRadius*scale, Terrarium)
        offscreen.pop()
        
        let validSpots = []
        offscreen.loadPixels()
        for (let i = 0; i < offscreen.pixels.length; i += 16) {
          if (offscreen.pixels[i] !== 0) {
            validSpots.push({
              x: (i % (offscreen.width * 4)) / 4,
              y: floor(i / (offscreen.width * 4))
            })
          }
        }
        offscreen.pixels = []

        // Create a few trees
        for (let i = 0; i < NumTrees / 6; i++) {
          let needsAndHasEyes = false
          let tree

          // Make sure we have at least 1 eye on a Buddy
          while (!needsAndHasEyes) {
            // Create random tress (and make [0] special)
            tree = new Moar.FractalTree({
              width: i < numBuddies ? this.width : this.width/treeScale,
              height: i < numBuddies ? this.height : this.height/treeScale,
              x: i < numBuddies ? this.width/2 : this.width/2/treeScale,
              y: i < numBuddies ? this.height : this.height/treeScale,
              bg: i < numBuddies ? TreeColor1 : TreeColor2,
              moar,
              len: i < numBuddies ? this.height/2.5 : random(this.height/10, this.height/3)/treeScale,
              shouldGrow: true,
              leafChance: i < numBuddies ? max(.1, EyeDensity / 100) : EyeDensity / 200,
              menu: false,
              thing: {
                angle: random(-PI/6, PI/6),
              }
            })

            if (i < numBuddies) {
              if (tree.things.length > 0) {
                needsAndHasEyes = true
              }
            } else {
              needsAndHasEyes = true
            }
          }
          this.store.trees.push(tree)

          // Draw eyes on the tree canvas
          this.store.trees.forEach(tree => {
            tree.things.forEach(thing => {
              thing.canvas = tree.canvas
            })
          })

          // Create a few clones (or just one for the main tree)
          let pos = getPlacement(floor(random(0, 9)))
          
          let numTrees = i < numBuddies ? 1 : NumTrees
          
          for (let j = 0; j < numTrees; j++) {
            if (i < numBuddies) {
              this.store.treeClones.push({
                isBuddy: true,
                canvas: this.store.trees[i].canvas,
                x: pos.x,
                y: 0,
                z: pos.z,
                size: 200
              })
            } else {
              let spot = validSpots.splice(floor(random(validSpots.length)), 1)[0]
              
              this.store.treeClones.push({
                isBuddy: false,
                canvas: this.store.trees[i].canvas,
                // x: cos(TWO_PI * random(-1, 1)) * 90,
                // z: sin(TWO_PI * random(-1, 1)) * 90,
                x: spot.x - sphereRadius,
                y: 0,
                z: spot.y - sphereRadius,
                size: random(50, 150)
              })
            }
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
  progress = Moar.getProgress(+params.loop || 3)

  // // Render each space sperately and draw moarThings (eyes and other basic shapes)
  Moar.draw((moar, canvas) => {
    const lookAt = createVector(0, -100, 0)
    const camPos = createVector(sin(TWO_PI * Moar.getProgress(3)) * -10, moar.store.cam.y, sin(TWO_PI * Moar.getProgress(3)) * -10 - moar.store.cam.z)
    const camDir = lookAt.copy().sub(camPos)

		// First paint the background
    canvas.background(moar.bgColors[BGColor])
    glc.resizeCanvas(canvas.width, canvas.height)
    glc.noStroke()
    glc.clear()

    let w, h, r, c, c2, numStripes, isFilled, step
    let orig = {
      x: moar.width/2,
      y: moar.height - moar.height / 10,
      size: min(moar.width, moar.height) / 2
    }
    
    switch (Background) {
      // Triangles
      case 0:
        w = 50
        h = 50
        r = 30
        c = [...moar.bgColors[BGColor]]
        c2 = [...moar.bgColors[BGColor2]]
        c2[2] += [1, 2].includes(BGColor) ? .10 : .05
        
        canvas.background(c)
        canvas.noStroke()
        canvas.fill(c2)

        for (let x = 0; x < moar.width + w; x += w) {
          for (let y = 0; y < moar.height + h; y += h) {
            canvas.push()
            canvas.translate(x, y)
            canvas.rotate(TWO_PI * Moar.getProgress(12))
            canvas.triangle(-0.866 * r, -.5 * r, 0.866 * r, -.5 * r, 0 * r, 1 * r)
            canvas.pop()
          }
        }        
      break

      // Circles
      case 1:
        w = 50
        h = 50
        r = 30
        c = [...moar.bgColors[BGColor]]
        c2 = [...moar.bgColors[BGColor2]]
        c2[2] += [1, 2].includes(BGColor) ? .10 : .05
        
        canvas.background(c)
        canvas.noStroke()
        canvas.fill(c2)

        for (let x = 0; x < moar.width + w; x += w) {
          for (let y = 0; y < moar.height + h; y += h) {
            canvas.push()
            canvas.circle(x, y, x % 2 === 0 ? sin(TWO_PI * Moar.getProgress(6)) * r : cos(TWO_PI * Moar.getProgress(6)) * r)
            canvas.circle(x + w/2, y + h/2, x % 2 === 1 ? sin(TWO_PI * Moar.getProgress(6)) * r : cos(TWO_PI * Moar.getProgress(6)) * r)
            canvas.pop()
          }
        }      
      break

      // Rays
      case 2:
        r = max(moar.width, moar.height) * 2
        numStripes = 18
        isFilled = false
        step = 360 / numStripes
        canvas.noStroke()

        c = [...moar.bgColors[BGColor]]
        c2 = [...moar.bgColors[BGColor2]]
        c2[2] += [1, 2].includes(BGColor) ? .15 : .05

        for (let i = 0; i < 360; i += step) {
          isFilled = !isFilled
          canvas.fill(isFilled ? c : c2)
          
          let x = orig.x + cos(radians(i + frameCount / 2)) * r
          let xx = orig.x + cos(radians((i + step) + frameCount / 2)) * r
          let y = orig.y + sin(radians(i + frameCount / 2)) * r
          let yy = orig.y + sin(radians((i + step) + frameCount / 2)) * r
          canvas.triangle(orig.x, orig. y, x, y, xx, yy)
        }
      break

      // Burst
      case 3:
        // Scaling stripes
        canvas.push()
        canvas.noStroke()
        canvas.translate(orig.x, orig.y)
        let loops = ceil(max(moar.width, moar.height) / (.5 * orig.size) * 3)
        let numColors = moar.bgColors.length - 1

        let sunColor = [...moar.bgColors[BGColor]]
        let bgColors = [[...sunColor]]
        let steps = 5
    
        if (BGColor === BGColor2) {
          // Darken and lighten (Must be odd number)
          for (let i = 0; i < steps; i++) {
            switch (BGColor) {
              case 0:
              case 1:
              case 6:
                sunColor[2] += .05
              break
              case 2:
                sunColor[2] += .07
              break
              case 3:
                sunColor[2] += .03
              break
              default:
                sunColor[2] -= .05
            }
            bgColors.push([...sunColor])
          }
        } else {
          for (let i = 0; i < steps; i++) {
            bgColors.push(canvas.lerpColor(canvas.color(moar.bgColors[BGColor]), canvas.color(moar.bgColors[BGColor2]), i / steps))
          }
        }
    
        for (let i = loops + 1; i > 0; i--) {
          const stripe = {
            size: max(0,
              orig.size * .5 * (i - loops / 2)
              //             👇 This is the number of frames it takes to do a full loop,
              //                so lets use a multiple of this number as the metronome for recording loop videos
              + frameCount % floor(numColors * orig.size * .5)
            ),
            colorMode: moar.colorMode,
            fill: bgColors[i % numColors],
            canvas
          }
          canvas.fill(bgColors[i % numColors])
          Moar.shape.star(canvas, 0, 0, stripe.size / 1.75, stripe.size / 2, 10)
        }

      canvas.pop()
      break
    }

    // Position the camera
    cam.setPosition(camPos.x, camPos.z, camPos.z)
    cam.lookAt(lookAt.x, lookAt.y, lookAt.z)
    cam._orbit(moar.store.cam.deltaTheta, moar.store.cam.deltaPhi, moar.store.cam.deltaZ)
    
    // Draw the trees
    moar.store.trees.forEach(tree => {
      tree.draw()
    })
    // Sort clones by distance
    // @fixme Move this to init and mousedrag for optimization
    const clones = moar.store.treeClones.map(clone => {
      const point = createVector(clone.x, clone.y, clone.z)
      return {
        clone,
        point,
        dist: point.copy().sub(camPos).dot(camDir), 
      }
    })
    .sort((a, b) => b.dist - a.dist)

    // Draw the base
    glc.drawingContext.enable(glc.drawingContext.DEPTH_TEST)
    glc.push()
    glc.translate(0, sphereRadius / 2.8 * 2, 0)
    glc.noStroke()
    glc.fill(0, 0, 0)
    glc.cylinder(sphereRadius * 1.25, sphereRadius * .75, 8, 8)
    glc.pop()

    // Draw the sphere so that the back faces get shown behind the trees
    glc.strokeWeight(FrameWidth)
    glc.stroke(color(255, 255, 255, FrameOpacity))
    glc.fill(255, 255, 255, 40)
    glc.sphere(sphereRadius, Terrarium, Terrarium)

    // Draw the base
    glc.push()
    glc.translate(0, sphereRadius / 2.8 * 2, 0)
    glc.noStroke()
    glc.fill(0, 0, 0)
    glc.cylinder(sphereRadius * 1.25, sphereRadius * .75, 8, 8)
    glc.pop()

    // Draw the ground
    glc.drawingContext.disable(glc.drawingContext.DEPTH_TEST)
    glc.push()
    glc.fill(moar.bgColors[BGColor])
    glc.noStroke()
    glc.rotate(PI/2, createVector(1, 0, 0))
    let scale = 1
    switch (Terrarium) {
      case 3:
        glc.rotate(PI/2, createVector(0, 0, 1))
        rot = PI/2
        scale = .85
      break
      case 4:
        scale = .85
      break
      case 5:
        glc.rotate(PI/2, createVector(0, 0, 1))
        rot = PI/2
        scale = .9
      break
      case 6:
        glc.rotate(PI/2, createVector(0, 0, 1))
        rot = PI/2
        scale = .9
      break
      case 7:
        glc.rotate(PI/2, createVector(0, 0, 1))
        rot = PI/2
        scale = .9
      break
      case 8:
        glc.rotate(PI/2, createVector(0, 0, 1))
        rot = PI/2
        scale = .9
      break
    }
    Moar.shape.polygon(glc, sphereRadius * scale, Terrarium, -sphereRadius/2.8)
    glc.pop()

		// Then paste the clones
    clones.forEach((clone, n) => {
      const tree = clone.clone
      let size = tree.size
      
      glc.strokeWeight(2)
      glc.noStroke()
      glc.push()
      glc.texture(tree.canvas)
      glc.translate(tree.x, tree.y - size / 2 + sphereRadius * .35, tree.z)
      glc.drawingContext.disable(glc.drawingContext.DEPTH_TEST)
      glc.plane(size * (tree.canvas.width/tree.canvas.height), size)
      glc.pop()
    })

    // Redwaw the sphere so that the front faces get shown in front of the trees
    glc.drawingContext.enable(glc.drawingContext.DEPTH_TEST)
    glc.strokeWeight(FrameWidth)
    glc.stroke(color(255, 255, 255, FrameOpacity))
    glc.fill(255, 255, 255, 40)
    glc.sphere(sphereRadius, Terrarium, Terrarium)

    canvas.image(webglCanvas, 0, 0)
  })
  
  // Overlay
  image(noiseOverlay, 0, 0)
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

      space.store.cam.deltaTheta = max(min(space.store.cam.deltaTheta, PI / 4), -PI / 4)
      space.store.cam.deltaPhi = max(min(space.store.cam.deltaPhi, -PI/8), -PI / 3)
    }
  })
}

// @todo Implment mouseWheel zooming
function mouseWheel (ev) {
  if (ev.delta > 0) {
    Moar.spaces[0].store.cam.deltaZ += 1 * 20
  } else {
    Moar.spaces[0].store.cam.deltaZ -= 1 * 20
  }
  Moar.spaces[0].store.cam.deltaZ = max(min(Moar.spaces[0].store.cam.deltaZ, 160), -80)
}

/**
 * Get the Position within the terrarium
 */
function getPlacement (pos) {
  switch (Terrarium) {
    case 3:
      switch (pos) {
        case 0:
          return {x: -sphereRadius/3, z: -sphereRadius/4}
        case 1:
          return {x: 0, z: -sphereRadius/4}
        case 2:
          return {x: sphereRadius/3, z: -sphereRadius/4}
        case 3:
          return {x: -sphereRadius/6, z: 0}
        case 4:
          return {x: 0, z: 0}
        case 5:
          return {x: sphereRadius/6, z: 0}
        case 6:
          return {x: -sphereRadius/12, z: sphereRadius/4}
        case 7:
          return {x: 0, z: sphereRadius/4}
        case 8:
          return {x: sphereRadius/12, z: sphereRadius/4}
      }

    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      switch (pos) {
        case 0:
          return {x: 0, z: -sphereRadius/2}
        case 1:
          return {x: -sphereRadius/3, z: -sphereRadius/4}
        case 2:
          return {x: sphereRadius/3, z: -sphereRadius/4}
        case 3:
          return {x: -sphereRadius/2, z: 0}
        case 4:
          return {x: 0, z: 0}
        case 5:
          return {x: sphereRadius/2, z: 0}
        case 6:
          return {x: -sphereRadius/3, z: sphereRadius/4}
        case 7:
          return {x: sphereRadius/3, z: sphereRadius/4}
        case 8:
          return {x: 0, z: sphereRadius/2}
      }
  }

  return false
}
