// Burnout
// ---
// For #WCCChallenge on Birb's Nest Discord: https://discord.gg/huD48bY5EZ
// Weekly challenge hosted by @sabelRaph: https://twitter.com/sableRaph
// Dreamt up by (∩｀-´)⊃━☆ﾟ.*・｡ﾟ @Metamoar: https://twitter.com/metamoar

/**
* Create a random set of eyes
*/
function setupScene (reset) {
  Moar.dispose()
  if (reset) {
    randomSeed(+params.seed)
    noiseSeed(+params.seed)
  }

  // This piece is square, so color background
  document.body.style.backgroundColor = `hsl(${Moar.defaults.bgColors[6][0]}, ${Moar.defaults.bgColors[6][1]*100}%, ${Moar.defaults.bgColors[6][2]*100}%)`

  // Global Dimensions
  let frameSize = max(width, height)
  frame = {
    width: frameSize / 20,
    height: frameSize / 20,
    size: frameSize,
    border: frameSize / 200,
  }

  let w = width - frame.width * 6
  let h = height - frame.height * 6
  
  /**
   * Create a space for the checker pattern
   */
  new Moar({
    id: 'checker',
    x: frame.width + frame.border,
    y: frame.height + frame.border,
    width: width - frame.width*2 - frame.border*2,
    height: height - frame.height*2 - frame.border*2,
    onDraw (space, canvas) {
      // Checkered pattern
      let switched = false
      let w = width - space.width - frame.width - frame.border*3
      let h = height / 20

      for (let y = 0; y < height + h * 2; y += h) {
        switched = !switched
        for (let x = 0; x < 2; x++) {

          let yShift = frameCount % (h * 2)
          
          if ((+switched + x) % 2 === 0) {
            canvas.fill(colors[6])
          } else {
            canvas.fill([100, 100, 100])
          }

          // Left side
          canvas.rect(w * x, y + yShift - h * 2, w, h)
          // right side
          canvas.rect(space.width - w - w * x, y - yShift - h * 2, w, h)
        }
      }
    }
  })

  /**
   * Northern box
   */
  let spaceHeight = (height - h)/2 - frame.height - frame.border*2
  new Moar({
    id: 'n',
    x: frame.width * 3,
    y: frame.height + frame.border,
    width: w,
    height: spaceHeight,
  })

  /**
   * Southern box
   */
  new Moar({
    id: 'n',
    x: frame.width * 3,
    y: height - spaceHeight - frame.height - frame.border,
    width: w,
    height: spaceHeight,
  })

  // Partition spaces
  let spaces = new Moar.BinarySpacePartition({
    depth: +params.spaces,
    width: w,
    height: h,
    x: frame.width * 3,
    y: frame.height * 3,
  })
  
  // If no subdivisions, then make it full screen
  if (+params.spaces === 0) {
    spaces = {partitions: [{
      width: w,
      height: h,
      x: frame.width * 3,
      y: frame.height * 3,
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

      onDraw (space, canvas) {
        canvas.background(space.bgColors[space.bg])
        // Redeye
        space.things[0].redEye = 65
      },

      // Also called whenever a key is pressed or the "Generate" context menu button is clicked
      onSetup (space) {
        randomSeed(space.seed)
        noiseSeed(space.seed)
        space.store.field = []

        let numEyes = [
          1,
          random(4, 12),
          random(4, 12),
          random(12, 24),
          random(12, 24),
          random(96, 128),
          random(128, 256),
        ]
    
        let size = min(space.width, space.height) / 2.5
        let sizeDiv = 1
        let eyeId = 0
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
            let eyelid = random(.3, .6)
            let pupilShape = 'random'
            let look = {mode: 'auto'}

            // Position a big eye in center
            if (!eyeId++) {
              x = space.width / 2
              y = space.height / 2
              eyeSize = size * 1.25
              pupilShape = 'circle'
            } else {
              while (!foundSpot || --maxLoops < 0) {
                x = random(space.width)
                y = random(space.height)

                // Manually position the pupils so that they point towards the big eye
                let look1 = createVector(x - space.width/2, y - space.height/2)
                let look2 = createVector(0, 0)
                
                look = {
                  mode: 'restricted',
                  timer: 0,
                  angle: () => {
                    let extraAngle = x > space.width/2 ? PI : 0
                    let distanceAngle = dist(look1.x, look1.y, look2.x, look2.y) / space.width * HALF_PI/2 * .95
                    return atan((look1.y - look2.y) / (look1.x - look2.x)) + extraAngle + random(-HALF_PI/2+distanceAngle, HALF_PI/2-distanceAngle)
                  }
                }
                
                // Check against center eye (the bounding box is 3 circles)
                foundSpot = true
                let d = dist(x, y, space.things[0].x, space.things[0].y) - eyeSize - space.things[0].size/1.8 /2
                if (d < 0) foundSpot = false
                d = dist(x, y, space.things[0].x + space.things[0].size/3.5, space.things[0].y) - eyeSize - space.things[0].size/2.35 /2
                if (d < 0) foundSpot = false
                d = dist(x, y, space.things[0].x - space.things[0].size/3.5, space.things[0].y) - eyeSize - space.things[0].size/2.35 /2
                if (d < 0) foundSpot = false
                
                // Check against other things
                if (foundSpot) {
                  for (let n = 1; n < space.things.length; n++) {
                    let d = dist(x, y, space.things[n].x, space.things[n].y) - eyeSize - space.things[n].size/2
                    if (d < 0) {
                      foundSpot = false
                      break
                    }
                  }
                }
              }
            }

            // Create the thing 👁️
            const thing = space.addThing({
              x,
              y,
              look,
              pupil: {shape: pupilShape},
              eyelid: {
                top: eyeId === 1 ? eyelid : null,
                color: eyeId === 1 ? space.randomFG() : space.bg
              },
              size: eyeSize,
              shape: eyeId === 1 ? 'almond' : 'circle',

              store: {blinkTimers: []},
              
              onClick: (clickedThing) => {
                // Blink things
                space.things.forEach(thing => {
                  let blinkSpeed = space.width / params.fps/2
                  let timer = (dist(clickedThing.x, clickedThing.y, thing.x, thing.y) - clickedThing.size/2 ) / blinkSpeed
                  
                  thing.store.blinkTimers.push(timer)
                })
              },

              // Countdown blink timers
              beforeDraw: (thing, canvas) => {
                thing.store.blinkTimers.forEach((timer, n) => {
                  thing.store.blinkTimers[n] -= 1

                  if (thing.store.blinkTimers[n] < 0) {
                    thing.curBlink = 0
                    thing.blinkTimer = timer
                    thing.store.blinkTimers.splice(n, 1)
                  }
                })
              }
            })

            thing.look.timer = 0
          }

          sizeDiv *= 1.5
        })
      }
    })
  })

  // Get colors
  colors = [[344, 1, .69], [37, 1, .50], [50, 1, .49], [104, 1, .32], [174, .62, .47], [252, .86, .58], [215, 1, .12]]
  if ($fxhashFeatures.isMonochrome) {
    frameBg = [...colors]
    let mono = frameBg[monochromeColor]

    frameBg = []
    colors.forEach((col, n) => {
      let newCol = [...mono]
      newCol[2] += .1 * (n - colors.length/2)
      if (monochromeColor === 3) {
        newCol[2] += .2
      }
      if (monochromeColor === 6) {
        newCol[2] += .35
      }
      
      frameBg.push(newCol)
    })
  } else {
    frameBg = [...colors]
  
    // Offset colors so they screenshot differently
    frameBg.pop()
    for (let i = 0; i < floor(random(frameBg.length)); i++) {
      frameBg.push(frameBg.shift())
    }
  }

  // Loop the colors
  let moreCols = []
  frameBg.forEach(col => {
    moreCols.push([...col])
  })
  moreCols.pop()
  moreCols.shift()
  frameBg.push(...moreCols.reverse())
  
  generateNoise()
  recenter()
}

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

  // Draw the edges
  drawFrame()
  
  // Draw spaces
  Moar.draw()

  // ?debug=1 Bounding box overlay
  if (+params.debug) {
    const thing = Moar.spaces[0].things[0]
    fill(255, 255, 255, 100)
    circle(thing.x, thing.y, thing.size/1.8)
    circle(thing.x+thing.size/3.5, thing.y, thing.size/2.35)
    circle(thing.x-thing.size/3.5, thing.y, thing.size/2.35)
  }

  
  // Noise overlay
  image(noiseOverlay, 0, 0)    

  // Record
  if (+params.record) {
    capturer.capture(canvas)
  }  
}

function drawFrame () {
  // Shuffle the colors around
  if (frameCount % floor(params.fps / 2) === 0 ) {
    frameBg.unshift(frameBg.pop())
  }

  // Frame
  colorMode(...Moar.spaces[0].colorMode)
  stroke(colors[6])
  strokeWeight(frame.border)

  fill(frameBg[0])
  rect(0, 0, width, height)
  fill(frameBg[1])
  rect(frame.width / 3, frame.height / 3, width - frame.width / 3 * 2, height - frame.height / 3 * 2)
  fill(frameBg[2])
  rect(frame.width / 3 * 2, frame.height / 3 * 2, width - frame.width / 3 * 4, height - frame.height / 3 * 4)

  noStroke()
  fill(colors[6])
  rect(frame.width / 3 * 3, frame.height / 3 * 3, width - frame.width / 3 * 6, height - frame.height / 3 * 6)
}