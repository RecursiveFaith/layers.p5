export default function () {

Layers.create(() => {
  new Layer({
    id: 'mat',
    renderer: WEBGL,

    menu: {
      bg () {return this.colors}
    },
    store: {},

    setup () {
      // Checkered pattern
      let switched = false
      let w = width / 8
      let h = height / 20
      let size = min(w, h)
  
      for (let n = 0; n < width/w*2; n++) {
        for (let y = 0; y < height + h * 2; y += h) {
          switched = !switched
          for (let x = 0; x < 2; x++) {
            let yShift = frameCount % ceil(h * 2)
            
            // Alternate fill along column
            if ((+switched + x) % 2 === 0) {
              offscreen.fill(0)
            } else {
              offscreen.fill(255)
            }
            
            offscreen.rect(width - size * (x + 1) - (n * size * 2), y - yShift, size, size)
            texture(offscreen)
          }
        }
      }
    },

    draw () {
      const ratio = width/height
      noStroke()

      // Fullscreen plane
      plane(width, height)

      // Make next drawings happen in reverse
      drawingContext.clear(drawingContext.DEPTH_BUFFER_BIT)
      push()
      translate(0, height/4)
      rotateX(PI/2.5)
      plane(maxSize*1.5*ratio, maxSize*1.5)
      pop()
    }
  })
})
}