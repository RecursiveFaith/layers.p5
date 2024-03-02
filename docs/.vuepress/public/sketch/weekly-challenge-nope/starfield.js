Layers.create(() => {
  /**
  * Starfield layer
  */
  new Layer({
    id: 'starfield',
    
    // These automatically convert into sliders
    // You can also bind with MIDI through right click!
    menu: {
      numStars: {min: 800, max: 1600, onChange () {this.setup()}},
      size: {min: () => minSize*.05, max: () => minSize*.15},
      speed: {min: 2, max: 40, default: random(2, 10)},
    },
    
    // Non menu variables
    // Access with $stars within draw(), setup()
    // or with this.store.stars everywhere else
    $: {
      stars: [],
      width: 2.5,
      height: 4
    },
    
    setup () {
      this.resize(width*$width, height*$height, false)

      $stars = []
      for (let i = 0; i < $numStars; i++) {
        $stars.push(new Star())
      }
    },
    
    // Each layer has own canvas
    // but p5 methods magically point to correct canvas so no need for canvas.background()
    draw () {
      background(0)
      push()
      translate(width/2, height/2)
      $stars.forEach((star, n) => {
        star.update()
        star.draw()
      })
      pop()
    }
  })

  /**
   * Star class
   */
  const Star = class {
    constructor () {
      this.x = random(-width, width)
      this.y = random(-height, height)
      this.z = random(width*.1, width * 1)
      this.life = 0
      this.lastZ = this.z
    }
    
    update () {
      this.z -= $speed
      if (this.z < 1) {
        this.x = random(-width/2, width/2)
        this.y = random(-height/2, height/2)
        this.z = random(width*.1, width * 1)
        this.lastZ = this.z
        this.life = 0
      }
    }
    
    draw () {
      noStroke()
      const sx = map(this.x / this.z, 0, 1, 0, width)
      const sy = map(this.y / this.z, 0, 1, 0, height)
      const r = map(this.z, 0, width, $size, 0)
      
      // Fade in
      this.life += 10
      fill(255, 255, 255, min(this.life, 255))
      // fill(255)
      ellipse(sx, sy, r, r)
      
      const px = map(this.x / this.lastZ, 0, 1, 0, width)
      const py = map(this.y / this.lastZ, 0, 1, 0, height)
      this.lastZ = this.z
      
      stroke(255, 255, 255, min(255, this.life))
      line(px, py, sx, sy)
    }
  }  
})