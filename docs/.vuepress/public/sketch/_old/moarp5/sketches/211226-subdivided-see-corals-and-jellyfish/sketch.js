
function setupScene (reset = false) {
  if (reset) {
  }

  // Free data and partition spaces
  Moar.dispose()
  let spaces = new Moar.BinarySpacePartition({
    depth: +params.spaces,
    width,
    height
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
  let bg = random([6])
  spaces.partitions.forEach(space => {
    
    // Create the scene
    new Moar({
      x: space.x,
      y: space.y,
      width: ceil(space.width),
      height: ceil(space.height),
      bg,

      // @see setup
      onSettings,

      store: {
        bg: floor(random(5)),
        bg1: 6,
        bg2: 6,
        seed: +params.seed,
        hasEyes: random() > .5,
      },

      // Also called whenever a key is pressed or the "Generate" context menu button is clicked
      onSetup (space) {
        if (this.store.seed) {
          randomSeed(this.store.seed + this.id)
          noiseSeed(this.store.seed + this.id)
          this.bg = floor(random(3))
        }
        
        // Create jellyfish
        let things = []
        for (let i = 0; i < random(40, 200)/spaces.partitions.length; i++) {
          let col = [...space.bgColors[random([4])]]
          col.push(random(1, 10) * .01)
          col[0] += random(-20, 20)

          things.push(space.addThing({
            x: random(space.width),
            y: random(space.height / 1.25),
            size: space.width / random(12, 24), //random(space.width / 36, space.width / 24),
            store: {
              color: col,
              strokeWeight: random(3),
              framecountShift: random(),
              speed: random([2, 4, 8]),
              aggressiveness: random(0.25, 1),
            },
            shape: 'circle',
            hidden: !this.store.hasEyes,
            autodraw: false,
            eyelid: {
              color: col,
              top: random(0.25, .8)
            }
          }))
        }

        // Create jellyfish
        this.store.trees = []
        for (let i = 0; i < random(30, 80)/spaces.partitions.length; i++) {
          tree = new Moar.FractalTree({
            x: random(this.width * 1.1) - this.width * 0.1,
            y: this.height,
            bg: random() > .15 ? 0 : random([1, 2, 4]),
            moar: space,
            leafChance: this.store.hasEyes ? random(0.1, 0.5) : 0,
            len: random(this.height/12, this.height/4),
            shouldGrow: true,
          })
          this.store.trees.push(tree)
        }

        // Contains all objects in random draw order
        this.store.things = []
        this.store.things.push(...this.store.trees, ...things)
        this.store.things = shuffle(this.store.things)
      }
    })
  })

  !+params.hideNoise && generateNoise()
  
  recenter()
}



/**
 * 🎨 Main draw loop
 */
function draw () {
  // Record
  if (frameCount === 10 && +params.record) {
    capturer.start()
  }

  // Render each space sperately and draw moarThings (eyes and other basic shapes)
  Moar.draw((space, canvas) => {
    colorMode(...space.colorMode)
    canvas.clear()

    let w, h, r, c, c2, numStripes, isFilled, step
    let orig = {
      x: space.width/2,
      y: space.height/10,
      size: min(space.width, space.height) / 2
    }

    // @fixme Move these backgrounds into Moar.js as default and have a case to handle custom backgrounds
    switch (space.store.bg) {
      // Triangles
      case 0:
        w = space.width/10
        h = space.width/10
        r = space.width/10 * (30/50)
        c = [...space.bgColors[space.store.bg1]]
        c2 = [...space.bgColors[space.store.bg2]]
        c2[2] += [1, 2].includes(space.store.bg1) ? .10 : .05
        
        canvas.background(c)
        canvas.noStroke()
        canvas.fill(c2)

        for (let x = 0; x < space.width + w; x += w) {
          for (let y = 0; y < space.height + h; y += h) {
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
        w = space.width/10
        h = space.width/10
        r = space.width/10 * (30/50)
        c = [...space.bgColors[space.store.bg1]]
        c2 = [...space.bgColors[space.store.bg2]]
        c2[2] += [1, 2].includes(space.store.bg1) ? .10 : .05
        
        canvas.background(c)
        canvas.noStroke()
        canvas.fill(c2)

        for (let x = 0; x < space.width + w; x += w) {
          for (let y = 0; y < space.height + h; y += h) {
            canvas.push()
            canvas.circle(x, y, sin(TWO_PI * Moar.getProgress(8)) * r)
            canvas.circle(x + w/2, y + h/2, cos(TWO_PI * Moar.getProgress(8)) * r)
            canvas.pop()
          }
        }      
      break

      // Rays
      case 2:
        r = max(space.width, space.height) * 2
        numStripes = 18
        isFilled = false
        step = 360 / numStripes
        canvas.noStroke()

        c = [...space.bgColors[space.store.bg1]]
        c2 = [...space.bgColors[space.store.bg2]]
        c2[2] += [1, 2].includes(space.store.bg1) ? .15 : .05

        for (let i = 0; i < 360; i += step) {
          isFilled = !isFilled
          canvas.fill(isFilled ? c : c2)
          
          let x = orig.x + cos(radians(i + Moar.getProgress(32+4)*360)) * r
          let xx = orig.x + cos(radians((i + step) + Moar.getProgress(32+4)*360)) * r
          let y = orig.y + sin(radians(i + Moar.getProgress(32+4)*360)) * r
          let yy = orig.y + sin(radians((i + step) + Moar.getProgress(32+4)*360)) * r
          canvas.triangle(orig.x, orig. y, x, y, xx, yy)
        }
      break

      // Burst
      case 3:
        // Scaling stripes
        canvas.push()
        canvas.noStroke()
        canvas.translate(orig.x, orig.y)
        let loops = ceil(max(space.width, space.height) / (.5 * orig.size) * 3) + 3
        let numColors = space.bgColors.length - 1

        let sunColor = [...space.bgColors[space.store.bg1]]
        let bgColors = [[...sunColor]]
        let steps = 5
        canvas.background(space.bgColors[space.store.bg1])
    
        if (space.store.bg1 === space.store.bg2) {
          // Darken and lighten (Must be odd number)
          for (let i = 0; i < steps; i++) {
            switch (space.store.bg1) {
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
            bgColors.push(lerpColor(color(space.bgColors[space.store.bg1]), color(space.bgColors[space.store.bg2]), i / steps))
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
            colorMode: space.colorMode,
            fill: bgColors[i % numColors],
            canvas
          }
          canvas.fill(bgColors[i % numColors])
          canvas.noStroke()
          Moar.shape.star(canvas, 0, 0, stripe.size / 1.75, stripe.size / 2, 10)
        }

      canvas.pop()
      break

      default:
        canvas.background(space.bgColors[space.store.bg1])
    }

    // Draw elements in order
    space.store.things.forEach(thing => {
      // Draw trees
      if (thing instanceof Moar.FractalTree) {
        canvas.drawingContext.shadowColor = '#000000aa'
        canvas.drawingContext.shadowBlur = 20
        thing.draw()
        canvas.image(thing.canvas, 0, 0)
        canvas.drawingContext.shadowBlur = 0
      // Draw jellyfish
      } else {
        const frame = Moar.wrap(Moar.getProgress(thing.store.speed) + thing.store.framecountShift, 0, 1)
        
        thing.eyeOffset.y = sin(frame * TWO_PI) * thing.size/8 - thing.size/8
        
        const numSegments = 32
        const thetaStep = PI / numSegments
        const waveDepth = 0.075
        const r = thing.size * 1.25
        const wrapAngle = PI/2 + thetaStep * 4
        
        // Draw the jellyfish
        let s = [...thing.store.color]
        s.pop()
        canvas.strokeWeight(thing.store.strokeWeight)
        canvas.stroke(s)
        canvas.fill(thing.store.color)
    
        canvas.push()
          canvas.translate(thing.x, thing.y + thing.size / 3)
          canvas.beginShape()
          // Right side
          for (let a = 0; a < PI; a += thetaStep) {
            const p1 = getJellyVertex(a, r, wrapAngle, thetaStep)
            const p2 = getJellyVertex(a + thetaStep, r, wrapAngle, thetaStep)
            const n1 = getJellyNormal(a, r, wrapAngle, thetaStep)
            const n2 = getJellyNormal(a + thetaStep, r, wrapAngle, thetaStep)

            p1.x += n1.x * sin(-frame * TWO_PI + p1.y * waveDepth) * thing.store.aggressiveness
            p1.y += n1.y * sin(-frame * TWO_PI + p1.y * waveDepth) * thing.store.aggressiveness
            p2.x += n2.x * sin(-frame * TWO_PI + p2.y * waveDepth) * thing.store.aggressiveness
            p2.y += n2.y * sin(-frame * TWO_PI + p2.y * waveDepth) * thing.store.aggressiveness

            canvas.vertex(p1.x, p1.y)
          }
          // Left side
          for (let a = PI; a > 0; a -= thetaStep) {
            const p1 = getJellyVertex(a, r, wrapAngle, thetaStep)
            const p2 = getJellyVertex(a + thetaStep, r, wrapAngle, thetaStep)
            const n1 = getJellyNormal(a, r, wrapAngle, thetaStep)
            const n2 = getJellyNormal(a + thetaStep, r, wrapAngle, thetaStep)

            p1.x += n1.x * sin(-frame * TWO_PI + p1.y * waveDepth) * thing.store.aggressiveness
            p1.y += n1.y * sin(-frame * TWO_PI + p1.y * waveDepth) * thing.store.aggressiveness
            p2.x += n2.x * sin(-frame * TWO_PI + p2.y * waveDepth) * thing.store.aggressiveness
            p2.y += n2.y * sin(-frame * TWO_PI + p2.y * waveDepth) * thing.store.aggressiveness

            canvas.vertex(-p1.x, p1.y)
          }
          canvas.endShape(CLOSE)

        canvas.pop()

        thing.draw()
      }
    })
  })
  
  // Overlay
  image(noiseOverlay, 0, 0)

  // Record
  if (+params.record) {
    capturer.capture(document.querySelector('#defaultCanvas0'))
  }  
}

// @see http://marcinignac.com/blog/cindermedusae-making-generative-creatures/
function getJellyVertex (a, r, wrapAngle, thetaStep) {
  const p = {x: 0, y: 0}
  const smoothRange = thetaStep * 3

  if (a < wrapAngle) {
    p.x = r * cos(a - PI/2)
    p.y = r * sin(a - PI/2)
  } else {
    if (a <= wrapAngle + smoothRange + 0.01) {
      const t = map(a, wrapAngle, wrapAngle + smoothRange, 0, PI/2)
      p.x = r * cos(a - PI/2)
      p.y = r * sin(wrapAngle - PI/2) + r * sin(t)
    } else {
      const t = map(a, wrapAngle + smoothRange, PI, PI/2, 0)
      p.x = 0.75 * r * cos(t - PI/2)
      p.y = 0.75 * r * sin(t - PI/2) + r * .5
    }
  }

  return p
}

function getJellyNormal (a, r, wrapAngle, thetaStep, amount = 10) {
  const p1 = getJellyVertex(a, r, wrapAngle)
  const p2 = getJellyVertex(a - thetaStep/2, r, wrapAngle)
  const n = {x: 0, y: 0}

  n.x = -(p2.y - p1.y)
  n.y = p2.x - p1.x

  return normalizeNormal(n, amount)
}

function normalizeNormal (vec, newLen = 1) {
  const len = sqrt(vec.x * vec.x + vec.y * vec.y)

  if (len === 0) {
    return vec
  }

  vec.x /= len
  vec.y /= len

  vec.x *= newLen
  vec.y *= newLen

  return vec
}