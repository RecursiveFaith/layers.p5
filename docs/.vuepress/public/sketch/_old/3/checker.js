export default function () {
Layers.create(() => {
  new Layer({
    id: 'checker',
  
    draw () {
      // Checkered pattern
      clear()
      let switched = false
      let w = width / 8
      let h = height / 20
      let size = min(w, h)
  
      for (let n = 0; n < 5; n++) {
        for (let y = 0; y < height + h * 2; y += h) {
          switched = !switched
          for (let x = 0; x < 2; x++) {
            let yShift = frameCount % ceil(h * 2)
            
            // Alternate fill along column
            if ((+switched + x) % 2 === 0) {
              fill(0)
            } else {
              fill(255)
            }
            
            rect(width - size * (x + 1) - (n * size * 2), y - yShift, size, size)
          }
        }
      }
    }
  })
})
}