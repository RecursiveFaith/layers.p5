export default function () {
class Box {
  constructor (opts) {
    this.x = opts.x
    this.y = opts.y
    this.z = opts.z
    this.size = opts.size
    this.color = opts.color
  }

  draw () {
    fill(this.color)
    stroke(255)

    push()
    translate(this.x, this.y, this.z)
    rotateX(frameCount*.01)
    rotateY(frameCount*.01)
    box(this.size)
    pop()

    this.x -= $boxSpeed
    if (this.x < -width - this.size*3) {
      this.x = width + this.size*3
    }    
  }
}

Layers.create(() => {
  new Layer({
    renderer: WEBGL,
    
    colors: [
      // @see http://www.colourlovers.com/color/10D7AE/VAPOR_WAVE_GREEN
      // green
      '#10D7AE',
      // @see https://www.schemecolor.com/vaporwave.php
      // pink
      '#E93479',
      // purple
      '#300350'
    ],

    menu: {
      boxDensity: {min: 4, max: 8},
      boxSpeed: {min: 1, max: 10, step: 0.1},
    },
    store: {
      fgBoxes: [],
      bgBoxes: []
    },
    
    setup () {
      $bgBoxes = []
      $fgBoxes = []
      const size = width/$boxDensity

      // Foreground boxes
      for (let y = -1; y < 2; y+=2) {
        for (let i = 0; i < ceil($boxDensity*2)+3; i++) {
          $fgBoxes.push(new Box({
            x: -width + size*i + size/2,
            y: height/4 * y,
            size: size*.5,
            color: this.colors[1]
          }))
        }
      }

      // Background boxes
      for (let y = -3; y < 4; y+=2) {
        for (let i = 0; i < ceil($boxDensity*2)+3; i++) {
          $bgBoxes.push(new Box({
            x: -width - size + size*i + size/2,
            y: height/4 * y,
            z: -width,
            size: size*.5,
            color: this.colors[1]
          }))
        }
      }

      // Misc
      offscreen.resizeCanvas(minSize, minSize)
    },

    methods: {
      /**
       * Draws the clock face
       */
      drawClock () {
        const clockSize = minSize*1.5

        offscreen.clear()
        offscreen.background(this.colors[2])
        offscreen.fill(255)
        offscreen.stroke(this.colors[1])
        offscreen.strokeWeight(minSize*.03)
        offscreen.circle(offscreen.width/2, offscreen.height/2, clockSize/2)
        texture(offscreen)
      },

      /**
       * Draws the sides of the clock
       */
      // @todo draw in separate throttled layer
      drawStripes (isHoriz) {
        offscreen.clear()
        offscreen.noStroke()

        const numStripes = 12
        const stripeWidth = minSize/numStripes

        for (let i = 0; i < numStripes; i++) {
          const isEven = i % 2 === 0
          offscreen.fill(isEven ? 255 : 0)

          if (isHoriz) {
            offscreen.rect(-minSize, i*stripeWidth, minSize*3, stripeWidth)
          } else {
            offscreen.rect(i*stripeWidth, -minSize, stripeWidth, minSize*3)
          }
        }
        texture(offscreen)
      }
    },

    draw () {
      const clockSize = minSize*1.5
      clear()
      background(this.colors[0])

      // Draw background boxes
      $bgBoxes.forEach(b => {
        b.draw()
      })
      $fgBoxes.forEach(b => {
        b.draw()
      })

      // Main Clock Box
      noStroke()
      push()
        translate(0, 0, -clockSize/2)
        rotateY(frameCount/(this.fps*3))
        // front
        this.drawClock()
        push()
          translate(0, 0, -clockSize/4)
          plane(clockSize/2)
        pop()
        // back
        push()
          translate(0, 0, clockSize/4)
          plane(clockSize/2)
        pop()
        // left
        this.drawStripes()
        push()
          rotateY(PI/2)
          translate(0, 0, -clockSize/4)
          plane(clockSize/2)
        pop()
        // right
        this.drawStripes(true)
        push()
          rotateY(-PI/2)
          translate(0, 0, -clockSize/4)
          plane(clockSize/2)
        pop()
      pop()
    }
  })
})
}