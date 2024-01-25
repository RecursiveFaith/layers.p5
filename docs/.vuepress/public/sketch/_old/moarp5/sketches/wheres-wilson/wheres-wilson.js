
/**
* WHERE'S WILSON
* Inspired by those fun hide and seek "Where's Waldo"/"Where's Wally" books
* For @sableRaph's Weekly Creative Coding Challenge
* Theme: Book Cover
* --------------------------------------------------
* Devlogs: https://metamoar.notion.site/WCCChallenge-Theme-Book-cover-59b4f626bd9a4db8baa916d2886b4f63
* --------------------------------------------------
* Made with moarP5.js by @metamoar
*/
// 9.94 x 0.18 x 12.44 inches
const bookRatio = (9.94 / 12.44)

/**
 * 🧰 Settings
 * --------------------------------------------------
 * These can also be configured through ?queryString params ✨
 * @todo Add these to right click menu
 */
function preload () {
  params = Object.assign({
		// Show debug info
    debug: 0,
  }, getURLParams())
}

/**
* 🎨 Main draw loop
*/
function draw () {
  const moar = Moar.spaces[0]
  const canvas = moar.canvas

  // Background color
  canvas.background()
  canvas.background(color(moar.bgColors[moar.bg]))

  // Draw the noise overlay and flair
  canvas.image(sandCanvas, 0, 0, moar.width, moar.height)
  canvas.noFill()

  // Scale things
  moar.things.forEach(thing => {
    if (!thing.hidden && thing.scale.size < 1) {
      thing.scale.size += 0.01
    }
  })
  
  // Paste the tree into the canvas
  moar.store.trees.forEach(tree => {
    if (!tree.hasGrown) {
      tree.draw()
      canvas.image(tree.canvas, 0, 0, moar.width, moar.height)
      tree.trunk.things.forEach(thing => {thing.draw()})
      image(canvas, 0, 0)
    }
  })

  // Bubbles
  moar.store.bubbles.forEach((bubble, n) => {
    bubble.acc += .15
    bubble.acc = min(bubble.acc, 5 + bubble.size / 10)
    bubble.y -= bubble.acc
    let xx = bubble.amp * sin(TWO_PI * (frameCount + bubble.frameCount) / bubble.period)

    canvas.stroke(255)
    canvas.noFill()
    canvas.circle(bubble.x + xx, bubble.y, bubble.size)

    if (bubble.y < -bubble.size) {
      moar.store.bubbles.splice(n, 1)
    }
  })
  
  // Frame
  let bg = Array(...moar.bgColors[moar.bg])
  bg[2] = bg[2] + 60
  canvas.stroke(bg)
  let w = moar.width
  let h = moar.height
  canvas.strokeWeight(3)
  canvas.rect(w / 60, h / 60, w - w / 60 * 2, h - h / 60 * 2, 4)

  image(canvas, 0, 0)

  // Postcard
  cardOverlay.clear()
  cardOverlay.strokeWeight(3)
  cardOverlay.rectMode(CENTER)
  
  cardOverlay.noStroke()
  cardOverlay.fill(0, 0, 0, 20)
  cardOverlay.rect(width/2, height/2, width, height)
  cardOverlay.stroke(0)
  image(cardOverlay, 0, 0)
  cardOverlay.clear()

  // Poscard shadow
  // @fixme Only draw once
  const cardWidth = width*.6
  const cardHeight = height*.6
  const cutoutRadius = cardWidth/20
  
  cardOverlay.push()
  cardOverlay.noStroke()
  cardOverlay.rotate(-PI / 60)
  cardOverlay.translate(width/2 - width/15, height/2 + height/20)
  cardOverlay.fill(0, 0, 0, 100)
  cardOverlay.rect(0, 0, cardWidth, cardHeight)

  cardOverlay.translate(-cardWidth/2, -cardHeight/2)
  for (let x = 0; x < cardWidth + cardWidth/10; x += cardWidth/10) {
    cardOverlay.noStroke()
    cardOverlay.fill(255)
    cardOverlay.erase()
    cardOverlay.circle(x, cardHeight, cutoutRadius)
    cardOverlay.noErase()
  }
  for (let y = 0; y < cardHeight + cardHeight/15; y += cardHeight/15) {
    cardOverlay.noStroke()
    cardOverlay.fill(255)
    cardOverlay.erase()
    cardOverlay.circle(0, y, cutoutRadius)
    cardOverlay.noErase()
  }

  cardOverlay.pop()
  image(cardOverlay, 0, 0)
  cardOverlay.clear()
  
  // Postcard card + hero
  cardOverlay.push()
  cardOverlay.translate(width / 2, height / 2)
  cardOverlay.rotate(-PI / 60)
  cardOverlay.fill(255, 255, 255)
  cardOverlay.rect(0, 0, cardWidth, cardHeight)

  // Postcard stamp effect
  cardOverlay.push()
  cardOverlay.translate(-cardWidth/2, -cardHeight/2)
  // Top and bottom row
  for (let x = 0; x < cardWidth + cardWidth/10; x += cardWidth/10) {
    cardOverlay.noStroke()
    cardOverlay.fill(255)
    cardOverlay.erase()
    cardOverlay.circle(x, 0, cutoutRadius)
    cardOverlay.circle(x, cardHeight, cutoutRadius)
    cardOverlay.noErase()

    cardOverlay.noFill()
    cardOverlay.stroke(0)
    cardOverlay.strokeWeight(3)
    if (x !== 0 && x < cardWidth) {
      cardOverlay.arc(x, 0, cutoutRadius, cutoutRadius, 0, -PI)
    } else if (x === 0) {
      cardOverlay.arc(x, 0, cutoutRadius, cutoutRadius, 0, HALF_PI)
    } else {
      cardOverlay.arc(x, 0, cutoutRadius, cutoutRadius, HALF_PI, -PI)
    }

    cardOverlay.noFill()
    cardOverlay.stroke(0)
    cardOverlay.strokeWeight(3)
    if (x !== 0 && x < cardWidth) {
      cardOverlay.arc(x, cardHeight, cutoutRadius, cutoutRadius, -PI, 0)
    } else if (x === 0) {
      cardOverlay.arc(x, cardHeight, cutoutRadius, cutoutRadius, -HALF_PI, 0)
    } else {
      cardOverlay.arc(x, cardHeight, cutoutRadius, cutoutRadius, -PI, -HALF_PI)
    }
  }

  // Left and right column
  for (let y = 0; y < cardHeight + cardHeight/15; y += cardHeight/15) {
    cardOverlay.noStroke()
    cardOverlay.fill(255)
    cardOverlay.erase()
    cardOverlay.circle(0, y, cutoutRadius)
    cardOverlay.circle(cardWidth, y, cutoutRadius)
    cardOverlay.noErase()

    cardOverlay.noFill()
    cardOverlay.stroke(0)
    cardOverlay.strokeWeight(3)
    if (y !== 0 && y < cardHeight) {
      cardOverlay.arc(0, y, cutoutRadius, cutoutRadius, -HALF_PI, HALF_PI)
    } else if (y === 0) {
      cardOverlay.arc(0, y, cutoutRadius, cutoutRadius, 0, HALF_PI)
    } else {
      cardOverlay.arc(0, y, cutoutRadius, cutoutRadius, -HALF_PI, 0)
    }

    cardOverlay.noFill()
    cardOverlay.stroke(0)
    cardOverlay.strokeWeight(3)
    if (y !== 0 && y < cardHeight) {
      cardOverlay.arc(cardWidth, y, cutoutRadius, cutoutRadius, HALF_PI, HALF_PI + PI)
    } else if (y === 0) {
      cardOverlay.arc(cardWidth, y, cutoutRadius, cutoutRadius, HALF_PI, PI)
    } else {
      cardOverlay.arc(cardWidth, y, cutoutRadius, cutoutRadius, -PI, -HALF_PI)
    }
  }
  cardOverlay.pop()

  cardOverlay.translate(0, -height / 13)
  cardOverlay.colorMode(...moar.colorMode)
  cardOverlay.fill(moar.colors[4])
  cardOverlay.rect(0, 0, width * .5, height * .35)
  cardOverlay.pop()
  
  // Postcard title
  cardOverlay.push()
  cardOverlay.textAlign(CENTER, CENTER)
  cardOverlay.fill(255)
  cardOverlay.stroke(0)
  cardOverlay.strokeWeight(4)
  cardOverlay.strokeCap(ROUND)
  cardOverlay.strokeJoin(ROUND)
  cardOverlay.textSize(height >= 800 ? 36 : 24)
  cardOverlay.textFont('sans-serif')
  cardOverlay.textStyle(BOLD)

  cardOverlay.rotate(-PI / 60)
  cardOverlay.translate(width / 2, height / 2)
  cardOverlay.colorMode(...moar.colorMode)
  cardOverlay.fill(moar.colors[5])
  cardOverlay.text(`WHERE'S                      `, 0, height / 6)
  cardOverlay.fill(moar.colors[0])
  cardOverlay.text(`                  WILSON?    `,0, height / 6)
  cardOverlay.fill(moar.colors[2])
  cardOverlay.textSize(height >= 800 ? 18 : 16)
  cardOverlay.noStroke()
  cardOverlay.text(`INTERACTIVE EDITION    `,0, height / 6 + height / 23)
  cardOverlay.fill(0)
  cardOverlay.textSize(height >= 800 ? 12 : 10)
  cardOverlay.text(`for Birb's Nest Weekly Creative Coding Challenge    `,0, height / 6 + height / 20 * 1.5)
  cardOverlay.pop()

  image(cardOverlay, 0, 0)

  // Draw Wilson
  push()
  rotate(-PI / 60)
  translate(-width / 30, -height / 2.605)

  // Paste the tree into the canvas
  wilson.draw((wilson, canvas) => {
    canvas.clear()
    $wilson.tree.draw()
    canvas.image($wilson.tree.canvas, 0, 0)
    $wilson.tree.trunk.things.forEach(thing => {thing.draw()})
    image(wilson.canvas, 0, 0)
  })

  pop()
  
  image(noiseOverlay, 0, 0)
}

/**
* MOOOOOAR SCENES 🍿
* (regenerates a new scene)
*/
function MOAR () {
  let hasTress = false
  
  Moar.dispose()
  $wilson = {
    width: width * .5,
    height: height * .75,
    tree: null
  }

	// Create main Moar.space
  moar = new Moar({
    bg: 4,
    
    // @todo automatically turn these into right click settings
    store: {
      // Random number to give an "official" feel
      id: floor(random(0, 10000)),
      depth: 0,
      trees: [],
      bubbles: []
    },

    // This is called when the Moar.js instance is (re)created
    onSetup (moar) {
      moar.store.trees = []
      let size = +params.columns
      const flowerCount = [size, size]
      
      if (params.columns > 0) {
        // Create a tree (eyes will be created in the last 2 branches)
        for (let y = 0; y < flowerCount[1] + 4; y++) {
          // Fewer trees the further down you go
          for (let x = 0; x < flowerCount[0] + 2 + (flowerCount[1] - y) * 2; x++) {
            let len = min(this.width, this.height) / flowerCount[0]

            let xx = x * width / (flowerCount[0] + 1 + (flowerCount[1] - y) * 2) + len + (y % 2 ? len / 2 : 0)
            let yy = y * height / flowerCount[1] + len
            
            noiseDetail(8, 0.15)
            let tree = new Moar.FractalTree({
              x: xx + noise(x, y) * len - len / 2 - len,
              y: yy + noise(x, y) * len - len / 2 - len,
              moar,
              bg: random() > .85 ? (random() > .5 ? 0 : 1) : 4,
              shouldGrow: true,
              shift: [floor(random(-30, 30)), floor(random(-30, 30)), flowerCount[1] - y * flowerCount[1] / 4],
              maxDepth: floor(random(params.maxDepth)) + 2,
              // @todo use params
              growStep: random(-120, 15),
              // growStep: random(30, 60),
              leafChance: params.leafChance,
              len: (len + len / flowerCount[1] * y * 2) * .5,

              /**
               * Create bubbles on blink
               */
              things: {
                angle: random(-PI / 8, PI / 8),
                size: 0,
                pupil: {
                  shape: 'random',
                  possibleShapes: ['circle', 'vert']
                },
                hidden: true,
                
                onBlink (thing) {
                  // Large bubbles
                  for (let n = 0; n < floor(random(1, 3)); n++) {
                    let size = random(thing.size / 6, thing.size / 4)
                    
                    thing.moar.store.bubbles.push({
                      x: thing.x + random(-thing.size / 2, thing.size / 2),
                      y: thing.y + random(-thing.size / 2, thing.size / 2),
                      size,
                      scale: {
                        size: 0
                      },
                      amp: random(size / 10, size),
                      acc: 0,
                      frameCount: floor(random(30)),
                      period: random(30, 90)
                    })
                  }

                  // Small bubbles
                  for (let n = 0; n < floor(random(6, 12)); n++) {
                    let size = random(thing.size / 48, thing.size / 16)
                    
                    thing.moar.store.bubbles.push({
                      x: thing.x + random(-thing.size / 2, thing.size / 2),
                      y: thing.y + random(-thing.size / 2, thing.size / 2),
                      size,
                      scale: {
                        size: 0
                      },
                      amp: random(size / 10, size),
                      acc: 0,
                      frameCount: floor(random(30)),
                      period: random(30, 90)
                    })
                  }
                }
              }
            })

            if (tree.things.length) {
              hasTress = true
            }
            
            this.store.trees.push(tree)
          }
        }

        // Add physics to each eye
        this.things.forEach(thing => {
          // thing.store.life = random(1, 5)
          thing.scale.size = 0
        })
      }

      // Make wilson a random tree with eyes
      if (!hasTress) MOAR()
      while (true) {
        let tree = random(this.store.trees)

        // Get the first thing with eyes
        if (tree.things.length) {
          // Create Wilson
          wilson = new Moar({
            width: moar.width,
            height: moar.height,
            bg: tree.config.bg,
          })
  
          $wilson.tree = new Moar.FractalTree({
            x: wilson.width / 2,
            y: wilson.height,
            moar: wilson,
            bg: 00,//wilson.bg,
            shouldGrow: false,
            maxDepth: floor(random(params.maxDepth)) + 2,
            leafChance: params.leafChance,
            len: moar.height / 3,
            seed: tree.seed,

            /**
             * Create bubbles on blink
             */
            things: {
              hidden: false,
              angle: random(-PI / 8, PI / 8),
              pupil: {
                shape: 'random',
                possibleShapes: ['circle', 'vert']
              },
            }
          })

          break
        }
      }
    }
  })

  
  // Sand
  sandCanvas.clear()
  sandCanvas.colorMode(RGB)
  sandCanvas.noStroke()
  sandCanvas.fill(0, 0, 0, 45)
  let noiseScale = 2
  for (let n = 0; n < 1; n++) {
    for (let x = 0; x < width / noiseScale; x++) {
      for (let y = 0; y < height / noiseScale; y++) {
        random() > .85 && sandCanvas.rect(x * noiseScale, y * noiseScale, noiseScale, noiseScale)
        random() > .85 && sandCanvas.rect(x * noiseScale * 2, y * noiseScale * 2, noiseScale * 2, noiseScale * 2)
        random() > .95 && sandCanvas.rect(x * noiseScale * 3, y * noiseScale * 3, noiseScale * 3, noiseScale * 3)
      }
    }
  }

  // Noise
  noiseOverlay.clear()
  noiseOverlay.pixelDensity(1)
  noiseOverlay.loadPixels()

  for (let i = 0; i < noiseOverlay.pixels.length; i += 4 * (floor(width % 2) + 3)) {
    noiseOverlay.pixels[i] = 255
    noiseOverlay.pixels[i+1] = 255
    noiseOverlay.pixels[i+2] = 255
    noiseOverlay.pixels[i+3] = random(40, 100)

    noiseOverlay.pixels[i+4] = 255
    noiseOverlay.pixels[i+5] = 255
    noiseOverlay.pixels[i+6] = 255
    noiseOverlay.pixels[i+7] = random(40, 100)
  }
  noiseOverlay.updatePixels()
}











/**
* Sketch entry point
*/
function setup() {
  params.fps && frameRate(params.fps)

  // Book dimensions 9.94 x 0.18 x 12.44
  createCanvas(windowHeight * (9.94 / 12.44), windowHeight)
  _renderer.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2, 'fixed')
  sandCanvas = createGraphics(width, height)
  noiseOverlay = createGraphics(width, height)
  cardOverlay = createGraphics(width, height)
 
  // Center the mouse so that the eyes start out centered
  mouseX = width / 2
  mouseY = height / 2
  MOAR()
  colorMode(...Moar.spaces[0].colorMode)

  document.addEventListener('moar-regenerate', function (ev) {
    // moar.canvas.clear()
    ev.detail.canvas.clear()
  })
}

/**
 * Tap with two fingers to recreate sketch
 */
function touchStarted () {
  if (touches.length > 1) {
    keyPressed()
  }
}

/**
 * Recenter all canvases
 */
function recenter () {
  mouseX = width / 2
  mouseY = height / 2

  _renderer.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2, 'fixed')
  sandCanvas.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2, 'fixed')
  noiseOverlay.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2, 'fixed')
  cardOverlay.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2, 'fixed')
}

/**
* Handle keypressed across multiple files
*/
function windowResized () {
  // resizeCanvas(height * bookRatio, height)
  // sandCanvas.resizeCanvas(width, height)
  // noiseOverlay.resizeCanvas(width, height)
  // cardOverlay.resizeCanvas(width, height)

  // MOAR()
}

/**
* Handle keypressed across multiple files
*/
function keyPressed () {
  recenter()
	MOAR()
}