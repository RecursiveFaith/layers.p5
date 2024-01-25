// super rushed so code is kinda crazy
// 🎞️ Set to true for perfect frame-by-frame recording
const RECORD = false
const RECORD_CONFIG = {
  framerate: 30,
  verbose: true,
  timeLimit: 14,
  format: 'webm'
}
let capturer
let isCapturerRunning = false

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
    if (this.x < -width - this.size*6) {
      this.x = width + this.size*6
    }    
  }
}

Layers.ready(() => {
  let hour = random(12)
  let minute = random(12)
  let second = random(12)
  new Layer({
    id: 'clock',
    menu: {
      hourMarks: {type: 'slider', min: 2, max: 12, step: 1},
      tickLength: {type: 'slider', min: 5, max: 50}
    },
    setup() {
      angleMode(DEGREES)
      this.$radius = min(width, height) / 2 - 50
      this.$hourMarks = 12
      this.$tickLength = 40
      document.querySelector('.layersp5-layer-clock').style.display = 'none'
    },
    draw() {
      const {$radius, $hourMarks, $tickLength} = this
      
      // Draw the clockface
      background(0)
      noStroke()
      fill('#fff')
      circle(width/2, height/2, $radius*2)
      stroke('#000')
      circle(width/2, height/2, $radius*1.8)
      // Draw the hour marks
      strokeWeight(5)
      for (let i = 0; i < $hourMarks; i++) {
        let angle = map(i, 0, $hourMarks, 0, 360)
        let tickLength = (i % 3 === 0) ? $tickLength*1.5 : $tickLength
        let x1 = width/2 + $radius*cos(angle)
        let y1 = height/2 + $radius*sin(angle)
        let x2 = width/2 + ($radius-tickLength)*cos(angle)
        let y2 = height/2 + ($radius-tickLength)*sin(angle)
        line(x1, y1, x2, y2)
      }
      // Draw the hands
      hour+=.001
      minute+=.005
      second+=.01
      strokeWeight(8)
      let hourHandAngle = map(hour%30, 0, 30, -90, 270)
      let minuteHandAngle = map(minute%30, 0, 30, -90, 270)
      let secondHandAngle = map(second%30, 0, 30, -90, 270)
      let hourHandLength = $radius * 0.5
      let minuteHandLength = $radius * 0.7
      let secondHandLength = $radius * 0.8
      push()
      translate(width/2, height/2)
      rotate(hourHandAngle)
      line(0, 0, hourHandLength, 0)
      pop()
      push()
      translate(width/2, height/2)
      rotate(minuteHandAngle + 180)
      line(0, 0, minuteHandLength, 0)
      pop()
      push()
      translate(width/2, height/2)
      rotate(secondHandAngle)
      strokeWeight(3)
      line(0, 0, secondHandLength, 0)
      noStroke()
      circle(0, 0, 10)
      pop()
    }
  })
  
  new Layer({
    renderer: WEBGL,
    id: 'boxes',
    
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
    colorMode: RGB,

    menu: {
      boxDensity: {min: 4, max: 8},
      boxSpeed: {min: 1, max: 10, step: 0.1},
    },
    $: {
      fgBoxes: [],
      bgBoxes: [],
      eyeCanvas: null,
      eyeOffscreen: null
    },
    
    setup () {
      $bgBoxes = []
      $fgBoxes = []
      this.things = []
      const size = width/$boxDensity

      // Foreground boxes
      for (let y = -1; y < 2; y+=2) {
        for (let i = 0; i < ceil($boxDensity*2)+6; i++) {
          $fgBoxes.push(new Box({
            x: -width + size*i + size/2,
            y: height/4 * y,
            size: size*.5,
            color: this.colors[1]
          }))
        }
      }

      // Background boxes
      for (let y = -6; y < 8; y+=2) {
        for (let i = 0; i < ceil($boxDensity*2)+6; i++) {
          $bgBoxes.push(new Box({
            x: -width - size + size*i + size/2,
            y: height/4 * y,
            z: -width - size*2,
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
            offscreen.rect(-minSize, i*stripeWidth-minSize/2, minSize*3, stripeWidth)
          } else {
            offscreen.rect(i*stripeWidth-minSize/2, -minSize, stripeWidth, minSize*3)
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
        rotateY(frameCount/(this.fps*1.5))
        // front
        texture(Layers.clock.canvas)
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
  
  if (RECORD) {
      new Layer({
        id: 'capture',
        setup () {
          // 🎞️ Configure video
          capturer = new CCapture(RECORD_CONFIG)

          setTimeout(() => {
            capturer.start()
            isCapturerRunning = true
          // Wait a few seconds for the scene to generate
          }, 3000)
        },

        draw () {
          image(Layers.boxes.canvas, 0, 0)
          // image(Layers.clock.canvas, 0, 0)

          if (isCapturerRunning) {
            capturer.capture(this.canvas.canvas)
          }
        }
      })
  }		
})