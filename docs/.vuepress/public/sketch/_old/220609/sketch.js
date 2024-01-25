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
      // @see https://www.colourlovers.com/palette/3636765/seapunk_vaporwave
      // green
      '#10D7AE',
      // pink
      '#FF6AD5'
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
            z: -width/1.3,
            size: size*.5,
            color: this.colors[1]
          }))
        }
      }
    },

    draw () {
      clear()
      background(this.colors[0])

      $bgBoxes.forEach(b => {
        b.draw()
      })

      // Clock
      push()
      translate(0, 0, -minSize*.6)
      rotateY(frameCount/(this.fps*3))
      box(minSize*.6)
      pop()
      
      $fgBoxes.forEach(b => {
        b.draw()
      })
    }
  })
})
}