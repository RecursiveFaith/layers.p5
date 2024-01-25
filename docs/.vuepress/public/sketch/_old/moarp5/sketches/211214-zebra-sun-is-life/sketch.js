
// 0.0.52
let main, secondary

function setupScene (reset = false) {
  if (reset) {
  }

  // Free data and partition spaces
  Moar.dispose()
  let space = new Moar.BinarySpacePartition({
    depth: +params.spaces,
    width: windowWidth - windowWidth/4,
    height: windowHeight
  })

  // If no subdivisions, then make it full screen
  if (+params.spaces === 0) {
    space = {partitions: [{
      x: 0,
      y: 0,
      width: windowWidth - windowWidth/4,
      height,
      depth: 0
    }]}
  }
    
  // Loop through each partition and create a moarSpace
  space.partitions.forEach(space => {
    // Create the scene
    main = new Moar({
      bg: 0,
      x: space.x,
      y: space.y,
      width: ceil(space.width),
      height: ceil(space.height),

      store: {
        numTrees: 50, //floor(random(1, 32)),
        trees: [],
        bg1: 0,
        bg2: 0,
        treeColor1: 4,
        treeColor2: 0,
        treeColor2Arr: [],
        eyeDensity: .5,
        bgType: 2
      },

      // Custom menu items
      // @see setup.js
      onSettings,

      // Also called whenever a key is pressed or the "Generate" context menu button is clicked
      onSetup () {
        this.store.trees = []
        
        // Setup colors
        this.store.bg1 = this.bg
        this.store.bg2 = Moar.wrap(this.bg, 0, this.bgColors.length)
        this.store.treeColor2Arr = Moar.chroma.hsl(this.bgColors[this.store.treeColor2]).hsl()

        // Create a few trees
        for (let i = 0; i < this.store.numTrees; i++) {
          // Create random tress (and make [0] special)
          const tree = new Moar.FractalTree({
            x: !i ? random(this.width / 3, this.width * 2 / 3) : random(0, this.width),
            y: this.height,
            bg: !i ? this.store.treeColor1 : this.store.treeColor2Arr,
            moar: this,
            len: !i ? this.height/3 : random(this.height/10, this.height/3),
            shouldGrow: true,
            leafChance: !i ? this.store.eyeDensity : 0, //this.store.eyeDensity / 10,
            things: {
              angle: random(-PI/6, PI/6),
            }
          })
          this.store.trees.push(tree)
        }

        this.store.trees.reverse()
      }
    })
  })

  secondary = new Moar({
    bg: 0,
    width: windowWidth/4,
    x: windowWidth - windowWidth/4,

    // Custom settings
    store: {
      resolution: 150,
      numStripes: 20,
      offset: {
        x: 100,
        y: 0
      },
      hexSize: 12,
      sunColor: 1
    },

    // Custom menu items
    onSettings (menu) {
      menu.general.addInput(this.store, 'sunColor', {
        min: 0,
        max: this.bgColors.length - 1,
        step: 1
      }).on('change', (ev) => {
        this.recreate()
      })
      menu.general.addInput(this.store, 'resolution', {
        min: 1,
        max: 2000,
        step: 1
      })
      menu.general.addInput(this.store, 'numStripes', {
        min: 0,
        max: 20,
        step: 1
      })
      menu.general.addInput(this.store, 'hexSize', {
        min: 3,
        max: floor(max(width, height) / 10),
        step: 1
      }).on('change', () => {
        this.tmp.relayoutHex()
      })
      menu.general.addInput(this.store, 'offset', {
        picker: 'inline',
        expanded: true,
        x: {min: -moar.width * 10, max: moar.width * 10, step: 1},
        y: {min: -moar.height * 10, max: moar.height * 10, step: 1}
      })
    },
    
    // Called whenever the "Generate" context menu button is clicked
    onSetup (moar) {
      // Update
      this.tmp.relayoutHex = () => {
        this.store.hex = {pointSize: Moar.HexGrid.Point(this.store.hexSize, this.store.hexSize)}
        this.store.hexes = []
        this.store.hex.layout = Moar.HexGrid.hexLayout(Moar.HexGrid.pointyOrient, this.store.hex.pointSize)
        let radius = ceil(max(moar.width, moar.height) / this.store.hexSize / 2)
        Moar.HexGrid.hexGenerateBoard(radius, this.store.hexes)
      }
      this.tmp.relayoutHex()
    }
  })

  generateNoise()
  recenter()
}



/**
 * 🎨 Main draw loop
 */
function draw () {
  // Pacemaker (not used yet)
  background(255)
  moar = Moar.spaces[0]



  // Render each space sperately
  progress = Moar.getProgress(+params.loop || 3)
  secondary.draw((moar, canvas) => {
    canvas.push()
    canvas.translate(secondary.width/2, secondary.height/2)
    canvas.noStroke()

    for (let i = 0; i < moar.store.hexes.length; i++) {
      let loc = Moar.HexGrid.hex2Screen(moar.store.hex.layout, moar.store.hexes[i])
      let coord = Moar.HexGrid.hexGetCoord(moar.store.hexes[i])
      let height
      let colors = []
      let res = 1/moar.store.resolution

      // Shuffle the colors
      if (moar.bg) {
        for (let i = 0; i < moar.bg; i++) {
          colors.push(colors.shift())
        }
      }

      // Add stripes
      for (let n = 0; n < moar.store.numStripes; n++) {
        colors.push(n % 2 ? 255 : 0)
      }

      // Get the height of the cell based on noise and looping state
      if (+params.loop) {
        let z = noise(cos(TWO_PI * progress) * .5 + 100, sin(TWO_PI * progress) * .5 + 100)
        height = noise(loc.x * res + moar.store.offset.x / 1000, loc.y * res + 100 + moar.store.offset.y / 1000, z)
      } else {
        if (+params.animate) {
          height = noise(loc.x * res + moar.store.offset.x / 1000, loc.y * res + 100 + moar.store.offset.y / 1000, frameCount / 500)
        } else {
          // height = noise(loc.x * this.store.hexSize + 100, loc.y * this.store.hexSize + 100)
          height = noise(loc.x * res + moar.store.offset.x / 1000, loc.y * res + moar.store.offset.y / 1000)
        }
      }
      let c
      
      // remove 3rd index from colors
      colors.splice(3, 1)
      c = colors[floor(height * 40) % colors.length]
      Moar.HexGrid.hexDraw(moar.store.hex.layout, moar.store.hexes[i], canvas.color(c), canvas)
    }
    canvas.pop()
  })


  
  // Draw the sun
  progress = Moar.getProgress(+params.loop || 14)
  let sunOffset = sin(TWO_PI * progress) * height/12
  colorMode(...secondary.colorMode)
  noStroke()
  fill(secondary.bgColors[secondary.store.sunColor])
  circle(width - width/8, height/3 + sunOffset, width/6)

  

  // Render each space sperately and draw moarThings (eyes and other basic shapes)
  main.draw((moar, canvas) => {
		// First paint the background
    moar.background()

    let w, h, r, c, c2, numStripes, isFilled, step
    let orig = {
      x: windowWidth - moar.width/8,
      y: moar.height/3,
      size: min(moar.width, moar.height) / 2
    }
    
    switch (moar.store.bgType) {
      // Triangles
      case 0:
        w = 50
        h = 50
        r = 30
        c = [...moar.bgColors[moar.bg]]
        c2 = [...moar.bgColors[moar.store.bg2]]
        c2[2] += moar.bg === moar.store.bg2 ? .10 : .05
        
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
        c = [...moar.bgColors[moar.bg]]
        c2 = [...moar.bgColors[moar.store.bg2]]
        c2[2] += [1, 2].includes(moar.bg) ? .10 : .05
        
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

        c = [...moar.bgColors[moar.bg]]
        c2 = [...moar.bgColors[moar.store.bg2]]
        c2[2] += [1, 2].includes(moar.bg) ? .15 : .05

        for (let i = 0; i < 360; i += step) {
          isFilled = !isFilled
          canvas.fill(isFilled ? c : c2)
          
          let x = orig.x + cos(radians(i + frameCount / 2)) * r
          let xx = orig.x + cos(radians((i + step) + frameCount / 2)) * r
          let y = orig.y + sin(radians(i + frameCount / 2)) * r
          let yy = orig.y + sin(radians((i + step) + frameCount / 2)) * r
          canvas.triangle(orig.x, orig.y, x, y, xx, yy)
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

        let sunColor = [...moar.bgColors[moar.bg]]
        let bgColors = [[...sunColor]]
        let steps = 5
    
        if (moar.bg === moar.store.bg2) {
          // Darken and lighten (Must be odd number)
          for (let i = 0; i < steps; i++) {
            switch (moar.bg) {
              case 0:
              case 1:
              case 6:
                sunColor[2] += 5
              break
              case 2:
                sunColor[2] += 7
              break
              case 3:
                sunColor[2] += 3
              break
              default:
                sunColor[2] -= 5
            }
            bgColors.push([...sunColor])
          }
        } else {
          for (let i = 0; i < steps; i++) {
            bgColors.push(lerpColor(color(moar.bgColors[moar.bg]), color(moar.bgColors[moar.store.bg2]), i / steps))
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

    // Draw the trees
    moar.store.trees.forEach(tree => {
      tree.draw()
      canvas.image(tree.canvas, 0, 0)
    })
  })
  
  // Overlay
  image(noiseOverlay, 0, 0)
}
