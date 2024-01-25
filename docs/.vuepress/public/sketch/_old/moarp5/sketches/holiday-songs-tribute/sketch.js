spaces = ['topLeft', 'topCenter', 'topRight', 'middleLeft', 'middleCenter', 'middleRight', 'bottomLeft', 'bottomCenter', 'bottomRight']
space = {}
colors = []
_strokeWeight = 0
disableDrawing = false

/**
* 🎨 Main draw loop
*/
let frameShift = 0
let frameBg = []
function draw () {
  // Shuffle the colors around
  if (frameCount % floor(params.fps / 2) === 0 ) {
    frameBg.push(frameBg.shift())
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
function setupScene () {
  Moar.dispose()
  
  frame = {
    width: width / 20,
    height: height / 20,
  }

  col4 = (width - frame.width * 2) / 4
  row4 = (height - frame.height * 2) / 4
  col6 = (width - frame.width * 2) / 6
  row6 = (height - frame.height * 2) / 6

  // Get colors
  // @todo lol this shouldn't be so hard
  colors = [[344, 1, .69], [37, 1, .50], [50, 1, .49], [104, 1, .32], [174, .62, .47], [252, .86, .58], [215, 1, .12]]
  frameBg = [...colors]
  frameBg.pop()
  
  // Setup all the individual moars
  spaces.forEach(spaceId => space[spaceId].setup())

  document.body.style.backgroundColor = `hsl(${Moar.spaces[0].bgColors[6][0]}, ${Moar.spaces[0].bgColors[6][1]*100}%, ${Moar.spaces[0].bgColors[6][2]*100}%)`
  generateNoise()
  recenter()
}