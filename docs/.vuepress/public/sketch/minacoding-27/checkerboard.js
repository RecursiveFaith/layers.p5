Layers.ready(() => {
  new Layer({
    id: 'checkerboard',
    draw () {
      // Checkered pattern
      noStroke()
      let count = 0
      let columns = 20
      if (width < 400) {
        columns = 8
      } else if (width < 800) {
        columns = 20
      } else if (width < 1600) {
        columns = 40
      } else {
        columns = 60
      }
      let w = width / columns
      let h = w
      
      for (let y = 0; y < height/h; y++) {
        if (y < height/h/6 - 1 || y > height/h*5/6) {
          for (let x = -4; x < columns + 4; x++) {
            let xShift = w * 2 * this.getProgress(4) * 2
            let dir = y > height/h/2 ? 1 : -1
            xShift *= dir
            
            if ((++count + y) % 2 === 0) {
              fill(255)
            } else {
              fill(0)
            }
  
            rect(w * x - xShift, y * h, w, h)
          }
        }
      }      

    }
  })
})