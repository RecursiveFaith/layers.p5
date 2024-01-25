
function setupScene (reset = false) {
  if (reset) {
  }

  // Free data and partition spaces
  Moar.dispose()
  let space = new Moar.BinarySpacePartition({
    depth: +params.spaces,
    width,
    height
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
  let bg = random([6])
  space.partitions.forEach(space => {
    // Create the scene
    new Moar({
      x: space.x,
      y: space.y,
      width: ceil(space.width),
      height: ceil(space.height),
      bg,

      // Also called whenever a key is pressed or the "Generate" context menu button is clicked
      onSetup (moar) {
        let col = moar.bgColors[moar.randomFG()]
        col.push(random())
        
        const thing = moar.addThing({
          x: moar.width/2,
          y: moar.height/2,
          size: moar.width / 4,
          store: {
            color: col,
            strokeWeight: random(3),
            framecountShift: random(),
            speed: random([2, 4, 8])
          },
          shape: 'circle',
          eyelid: {
            color: col,
            top: random(0.25, .8)
          }
        })
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
  if (frameCount === 1 && +params.record) {
    capturer.start()
  }

  // // Render each space sperately and draw moarThings (eyes and other basic shapes)
  Moar.draw((moar, canvas) => {
    moar.background()

    moar.things.forEach(thing => {
      // const frame = (frameCount + thing.store.framecountShift) / thing.store.speed
      const frame = Moar.wrap(Moar.getProgress(thing.store.speed) + thing.store.framecountShift, 0, 1)
      
      thing.eyeOffset.y = sin(frame * TWO_PI) * moar.height / 30
      
      const numSegments = 32
      const thetaStep = PI / numSegments
      const waveDepth = 0.075
      const r = thing.size * 1.25
      const wrapAngle = PI + thetaStep * 4
      
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

          p1.x += n1.x * sin(-frame * TWO_PI + p1.y * waveDepth)
          p1.y += n1.y * sin(-frame * TWO_PI + p1.y * waveDepth)
          p2.x += n2.x * sin(-frame * TWO_PI + p2.y * waveDepth)
          p2.y += n2.y * sin(-frame * TWO_PI + p2.y * waveDepth)

          canvas.vertex(p1.x, p1.y)
        }
        // Left side
        for (let a = PI; a > 0; a -= thetaStep) {
          const p1 = getJellyVertex(a, r, wrapAngle, thetaStep)
          const p2 = getJellyVertex(a + thetaStep, r, wrapAngle, thetaStep)
          const n1 = getJellyNormal(a, r, wrapAngle, thetaStep)
          const n2 = getJellyNormal(a + thetaStep, r, wrapAngle, thetaStep)

          p1.x += n1.x * sin(-frame * TWO_PI + p1.y * waveDepth)
          p1.y += n1.y * sin(-frame * TWO_PI + p1.y * waveDepth)
          p2.x += n2.x * sin(-frame * TWO_PI + p2.y * waveDepth)
          p2.y += n2.y * sin(-frame * TWO_PI + p2.y * waveDepth)

          canvas.vertex(-p1.x, p1.y)
        }
        canvas.endShape(CLOSE)
        
      canvas.pop()
      
      thing.draw()
    })
  })

  // Overlay
  image(noiseOverlay, 0, 0)

  // Record
  if (+params.record) {
    capturer.capture(canvas)
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
      p.y = r * sin(wrapAngle - PI/2) + 20 * sin(t)
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