Layers.ready(() => {
  new Layer({
    id: 'starfield',
    bg: 6,
    menu: {
      scale: {min: .005, max: 1},
      shrinkFactor: {min: .9, max: .999}
    },
    setup() {
      this.circles = []
      this.addCircle = () => {
        let ok = false
        let attempts = 0
        while (!ok) {
          let candidate = {
            r: min(width, height) * (random(.25, 1.5)*$scale),
            x: random(width),
            y: random(height)
          }
          ok = this.circles.every(c => dist(c.x, c.y, candidate.x, candidate.y) > c.r + candidate.r)
          if (ok) {
            this.circles.push(candidate)
          } else {
            attempts++
          }
          if (attempts >= 100) {
            //noLoop()
            break
          }
        }
      }
      this.addCircle()
    },
    draw() {
      clear()
      this.circles.forEach(c => {
        textAlign(CENTER, CENTER)
        textSize(c.r*1.5)
        text('⭐', c.x, c.y)
      })
      for (let i = 0; i < this.circles.length; i++) {
        let c = this.circles[i]
        if (c.r > 1) {
          c.r *= $shrinkFactor
        } else {
          this.circles.splice(i, 1)
        }
      }
      if (frameCount % 2 === 0) {
        for (let i = random(60); i > 0; i--) {
          this.addCircle()
        }
      }
    }
  })
})