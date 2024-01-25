// spaces = ['topLeft', 'topCenter', 'topRight', 'middleLeft', 'middleCenter', 'middleRight', 'bottomLeft', 'bottomRight']
spaces = ['topLeft', 'topCenter', 'topRight', 'middleLeft', 'middleCenter', 'middleRight', 'bottomLeft', 'bottomRight']
cornerRules = []
space = {}
origSpace = {}
colors = []
_strokeWeight = 0
disableDrawing = false
monochromeColor = 6

/**
* 🎨 Main draw loop
*/
let frameShift = 0
let frameBg = []
function draw () {
  if (frameCount === 3 && typeof fxpreview === 'function') {
    fxpreview()
  }
  
  // Shuffle the colors around
  if (frameCount % floor(params.fps / 2) === 0 ) {
    frameBg.unshift(frameBg.pop())
  }
  
  // Frame
  colorMode(...Moar.spaces[0].colorMode)
  stroke(colors[6])
  strokeWeight(width / 200)

  fill(frameBg[0])
  rect(0, 0, width, height)
  fill(frameBg[1])
  rect(frame.width / 3, frame.height / 3, width - frame.width / 3 * 2, height - frame.height / 3 * 2)
  fill(frameBg[2])
  rect(frame.width / 3 * 2, frame.height / 3 * 2, width - frame.width / 3 * 4, height - frame.height / 3 * 4)

  noStroke()
  fill(colors[6])
  rect(frame.width / 3 * 3, frame.height / 3 * 3, width - frame.width / 3 * 6, height - frame.height / 3 * 6)

  // Draw moars
  spaces.forEach(spaceId => space[spaceId].draw())

  // Noise overlay
  image(noiseOverlay, 0, 0)    
}

/**
* Create a random set of eyes
*/
function setupScene (reset) {
  if (reset) {
    randomSeed(+params.seed)
    noiseSeed(+params.seed)
  }

  Moar.dispose()
  
  // Global Dimensions
  frame = {
    width: width / 20,
    height: height / 20,
  }
  col4 = (width - frame.width * 2) / 4
  row4 = (height - frame.height * 2) / 4
  col6 = (width - frame.width * 2) / 6
  row6 = (height - frame.height * 2) / 6
  
  // Corner rules
  cornerRules = [
    {
      corner: 'topLeft',
      x: frame.width,
      y: frame.height,
    },
    {
      corner: 'topRight',
      x: frame.width + col4 * 3,
      y: frame.height,
    },
    {
      corner: 'bottomLeft',
      x: frame.width,
      y: frame.height + row4 * 3,
    },
    {
      corner: 'bottomRight',
      x: frame.width + col4 * 3,
      y: frame.height + row4 * 3,
    }
  ]
  let origCornerRules = [...cornerRules]

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

  // Same corner
  if ($fxhashFeatures.sameCorners) {
    let newCornerRules = [cornerRules]
    newCornerRules = shuffle(cornerRules)
    let corner = newCornerRules[0].corner

    space.topLeft.setup = space[corner].setup
    space.topRight.setup = space[corner].setup
    space.bottomLeft.setup = space[corner].setup
    space.bottomRight.setup = space[corner].setup

    space.topLeft.draw = space[corner].draw
    space.topRight.draw = space[corner].draw
    space.bottomLeft.draw = space[corner].draw
    space.bottomRight.draw = space[corner].draw
  } else {
    cornerRules = shuffle(cornerRules)
  }

  // Setup all the individual moars
  spaces.forEach(spaceId => space[spaceId].setup())
  origSpace = Moar.cloneDeep(space)

  // Update corner positions
  if ($fxhashFeatures.sameCorners) {
    space.topLeft.moar.x = origCornerRules[0].x
    space.topLeft.moar.y = origCornerRules[0].y
    space.topRight.moar.x = origCornerRules[1].x
    space.topRight.moar.y = origCornerRules[1].y
    space.bottomLeft.moar.x = origCornerRules[2].x
    space.bottomLeft.moar.y = origCornerRules[2].y
    space.bottomRight.moar.x = origCornerRules[3].x
    space.bottomRight.moar.y = origCornerRules[3].y
  }

  space.topLeft.moar.id = 'topLeft'
  space.topRight.moar.id = 'topRight'
  space.bottomRight.moar.id = 'bottomRight'
  space.bottomLeft.moar.id = 'bottomLeft'

  const bgColors = [[344, 1, .69], [37, 1, .50], [50, 1, .49], [104, 1, .32], [174, .62, .47], [252, .86, .58], [215, 1, .12]]
  document.body.style.backgroundColor = `hsl(${bgColors[6][0]}, ${bgColors[6][1]*100}%, ${bgColors[6][2]*100}%)`
  generateNoise()
  recenter()
}

/**
 * Draws the white border for corners
 * @param {*} corner 
 */
function drawCornerFrame (corner, canvas) {
  const moar = space[corner].moar

  switch (corner) {
    case 'topLeft':
      // Frame
      canvas.push()
      canvas.noFill()
      canvas.stroke(colors[6])
      canvas.strokeWeight(_strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      
      canvas.translate(_strokeWeight, _strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
  
      // White corner frame
      canvas.stroke(colors[6])
      canvas.fill(100, 100, 100)
      canvas.rect(0, moar.height - _strokeWeight - moar.height / 15, moar.width - _strokeWeight, moar.height / 15)
      canvas.rect(moar.width - moar.width / 15 - _strokeWeight, _strokeWeight / 4, moar.width / 15, moar.height - moar.height / 15 - _strokeWeight * 1.5)
  
      canvas.noStroke()
      canvas.rect(moar.width - moar.width / 15 - _strokeWeight / 2, moar.height - _strokeWeight * 2 - moar.height / 15, moar.width / 15 - _strokeWeight, moar.height / 15)
  
      canvas.pop()
    break      
    
    case 'topRight':
      // Frame
      canvas.push()
      canvas.noFill()
      canvas.stroke(colors[6])
      canvas.strokeWeight(_strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      
      canvas.translate(-_strokeWeight, _strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
 
      // White corner frame
      canvas.stroke(colors[6])
      canvas.fill(100, 100, 100)
      canvas.rect(_strokeWeight, _strokeWeight / 4, moar.width / 15, moar.height - moar.height / 15 - _strokeWeight * 1.5)
      canvas.rect(_strokeWeight, moar.height - moar.height / 15 - _strokeWeight, moar.width - _strokeWeight, moar.height / 15)
 
      canvas.noStroke()
      canvas.rect(_strokeWeight * 1.5, moar.height - moar.height / 15 - _strokeWeight * 2, moar.width / 15 - _strokeWeight, moar.height / 15)

      canvas.pop()
    break

    case 'bottomLeft':
      // Frame
      canvas.push()
      canvas.noFill()
      canvas.stroke(colors[6])
      canvas.strokeWeight(_strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      
      canvas.translate(_strokeWeight, _strokeWeight)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)

      // White corner frame
      canvas.stroke(colors[6])
      canvas.fill(100, 100, 100)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 2, moar.width - _strokeWeight / 2, moar.height / 15)
      canvas.rect(moar.width - _strokeWeight / 4 - moar.width / 15, _strokeWeight / 4 + moar.height / 15, moar.width - _strokeWeight / 2, moar.height - moar.height / 15 - _strokeWeight * 2)

      canvas.noStroke()
      canvas.rect(moar.width + _strokeWeight / 4 - moar.width / 15, _strokeWeight, moar.width - _strokeWeight / 2, moar.height / 15)

      canvas.pop()
    break

    case 'bottomRight':
      // Frame
      canvas.push()
      canvas.noFill()
      canvas.stroke(colors[6])
      canvas.strokeWeight(_strokeWeight)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      canvas.rect(-_strokeWeight / 4, -_strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      
      canvas.translate(-_strokeWeight, _strokeWeight)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
    
      // White corner frame
      canvas.stroke(colors[6])
      canvas.fill(100, 100, 100)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 2, moar.width - _strokeWeight / 4, moar.height / 15)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4 + moar.height / 15, moar.width / 15 - _strokeWeight / 2, moar.height - moar.height / 15 - _strokeWeight * 2)

      canvas.noStroke()
      canvas.rect(_strokeWeight / 4, _strokeWeight, moar.width / 15 - _strokeWeight, moar.height / 15)
    
      canvas.pop()
    break
  }
}