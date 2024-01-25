/*
 This is a special "type: filter" layer
 During a filter's .draw(), the canvas will be prefilled with the pixels of all the layers below it.
 Filters are useful for adding texture or for drawing on multiple layers at once
 */
 Layers.generate(() => {
  new Layer({
    id: 'texturizer',
    type: 'filter',
    // disabled: true,
    menuDisabled: true,
    
    draw () {
      // Add noise
      let noiseAmount = 70
      let x = 0
      let y = 0

      // First pass (perlin noise)
      loadPixels()

      for (let i = 0; i < pixels.length; i+=4) {
        if (pixels[i+3] > 0) {
          pixels[i] += noiseAmount - noise(x*.1, y*.1) * noiseAmount*2
          pixels[i+1] += noiseAmount - noise(x*.1, y*.1) * noiseAmount*2
          pixels[i+2] += noiseAmount - noise(x*.1, y*.1) * noiseAmount*2
          x++
          if (x > width) {
            x = 0
            y++
          }
        }
      }
    
      // Second pass (roughgen)
      noiseAmount = 50
      for (let i = 0; i < pixels.length; i+=4) {
        if (pixels[i+3] > 0) {
          pixels[i] += noiseAmount - noise(i*.1) * noiseAmount*2
          pixels[i+1] += noiseAmount - noise(i*.1) * noiseAmount*2
          pixels[i+2] += noiseAmount - noise(i*.1) * noiseAmount*2
          x++
          if (x > width) {
            x = 0
            y++
          }
        }
      }
    
      // Third pass (random)
      noiseAmount = 25
      for (let i = 0; i < pixels.length; i+=4) {
        if (pixels[i+3] > 0) {
          pixels[i] += random(-noiseAmount, noiseAmount)
          pixels[i+1] += random(-noiseAmount, noiseAmount)
          pixels[i+2] += random(-noiseAmount, noiseAmount)
          x++
          if (x > width) {
            x = 0
            y++
          }
        }
      }

      updatePixels()
    }
  })  
})



/**
 * Tap with two fingers to recreate sketch
 */
function touchStarted () {
  if (touches.length > 1) {
    generateLayers(true)
  }
}