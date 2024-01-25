Layers.create(() => {
  new Layer({
    id: 'mountains',
    noLoop: true,
    
    menu: {
      y: {min: .5, max: .7},
      rings: {min: 3, max: 6},
    },
    $: {
      circles: []
    },
    colorMode: [HSL, 360, 100, 100, 100],

    setup () {
      // Add a margin and center
      clear()
      canvas.resizeCanvas(width*.8, height*.8)
      canvas.ellipseMode(CENTER)
      this.x = width*.1
      this.y = height*.1
      $circles = []
      // this.colors = Layers.default.colors.slice(3, 6)
      this.colors = [[174,62,47]]

      // Recursivly create circles across the width of canvas of varying sizes but with same y
      const createCircle = (x, size, skip = false) => {
        const color2 = random([[random(25, 50), random(25, 50), random(25, 50)]])
        
        const config = {
          x,
          size,
          color: [this.colors[0][0]+random(-25, 25), this.colors[0][1]+random(-10, 10), this.colors[0][2]+random(-10, 10)],
          color2: [color2[0]+random(-25, 25), color2[1]+random(-10, 10), color2[2]+random(-10, 10)]
        }
        
        $circles.push(config)
        if (!skip && x < width) {
          // Create next circle
          const newSize = round(random(maxSize*.05, maxSize*.25))
          createCircle(x+(size+newSize)/2, newSize)

          // Create sub circles
          for (let i = 0; i < $rings; i++) {
            const subSize = size - size/$rings * (i+1)
            createCircle(x, subSize, true)
          }
        }
      }
      createCircle(0, round(random(maxSize*.05, maxSize*.25)))
    },

    draw () {
      clear(0)
      noStroke()
      $circles.forEach((c, n) => {
        // Draw circle
        fill(c.color)
        circle(c.x, $y*height, c.size)

        // Draw rectangle
        fill(c.color2)
        rect(c.x-c.size/2, $y*height, c.size, height)
      })
    }
  })
})