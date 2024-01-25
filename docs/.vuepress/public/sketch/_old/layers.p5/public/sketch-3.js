/*
 This is a special "type: filter" layer
 During a filter's .draw(), the canvas will be prefilled with the pixels of all the layers below it.
 Filters are useful for adding texture or for drawing on multiple layers at once
 */
Layers.generate(() => {
  new Layer({
    id: 'checkers',

    menu: {
      columnMult: {min: .25, max: 3, step: .25},
      colorExclude: {max: 2, step: 1, default: 2},
      height: {min: 2, max: 20, default: ~~random(4, 6)},
      style: {max: 3, step: 1}
    },
    
    draw () {
      clear()
      
      if (windowWidth < 400) {
        columns = 8
      } else if (windowWidth < 800) {
        columns = 20
      } else if (windowWidth < 1600) {
        columns = 40
      } else {
        columns = 60
      }
      columns *= this.store.columnMult
      let w = width / columns
      let h = w

      
      // Checkered pattern
      let count = 0
      let size = {h, w, columns}

      for (let y = 0; y < height/size.h; y++) {
        if (y < height/size.h/this.store.height - 1 || y > height/size.h*((this.store.height-1)/this.store.height)) {
          for (let x = -4; x < size.columns + 4; x++) {
            let xShift = size.w * 2 * this.getProgress(4) * 2
            let dir = y > height/size.h/2 ? 1 : -1
            xShift *= dir
            
            let colors = [...this.colors]
            colors.splice(this.store.colorExclude, 1)

            switch (this.store.style) {
              // Vertical stripes
              case 1:
                if (x % 2 === 0) {
                  fill(colors[0])
                } else {
                  fill(colors[1])
                }
              break

              // Horizontal stripes
              case 2:
                if (y % 2 === 0) {
                  fill(colors[0])
                } else {
                  fill(colors[1])
                }
              break

              // Diagnol stripes
              case 3:
                if ((x+y)%3 === 0) {
                  fill(colors[0])
                } else {
                  fill(colors[1])
                }
              break

              // Checkerboard
              default:
                if ((++count + y) % 2 === 0) {
                  fill(colors[0])
                } else {
                  fill(colors[1])
                }
            }

            noStroke()
            rect(ceil(size.w * x - xShift), ceil(y * size.h), ceil(size.w), ceil(size.h))
          }
        }
      }      
    }
  })
})
