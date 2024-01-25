Layers.ready(() => {
  new Layer({
    id: 'frog',
    
    menu: {
      faceOffY: {min: 0, max: minSize/10},
      faceHeight: {min: .5, max: 2.5, step: .1},
      faceWidth: {min: minSize/5, max: minSize/3},
      bodyWidth: {min: minSize/6, max: minSize*2},
      eyeSize: {min: minSize/6, max: minSize/3},
    },

    setup () {
      // Setup eyes
      this.things = []
      $bg = this.colors[4]
      const config = {
        x: width/2,
        y: height/2,
        size: $eyeSize,
        shape: 'circle',
        iris: {color: ~~random(this.colors.length-1)},
        pupil: {
          shape: random(['circle', 'vert', 'horiz', 'rect'])
        },
        eyelid: {top: random(.5, .85)},
      }
      
      // left eye
      this.addEye({
        blink: {
          lookWait: 1000,
          maxWait: 3500,
        },
        ...config
      })
      this.addEye({
        blink: {
          lookWait: 1000,
          maxWait: 3500,
        },
        ...config
      })
    },

    draw () {
      clear()
      fill(this.colors[4])

      // Draw body
      fill(this.colors[4])
      ellipse(width/2, height*1.5, $bodyWidth, height*2)
      
      // Draw face as centered on eyes
      offscreen.clear()
      offscreen.fill(this.colors[4])
      offscreen.ellipse(width/2, height/2 + $faceOffY, $faceWidth*2, this.things[0].size*$faceHeight)

      // Draw lower half of face
      offscreen.drawingContext.globalCompositeOperation = 'source-atop'
      offscreen.fill(this.colors[2])
      offscreen.stroke(this.colors[0])
      offscreen.strokeWeight(3)
      offscreen.ellipse(width/2, height/2 + $faceOffY + this.things[0].size*$faceHeight/2, $faceWidth*2, this.things[0].size*$faceHeight/1.5)
      offscreen.drawingContext.globalCompositeOperation = 'source-over'

      image(offscreen, 0, 0)

      // Wide eyes
      this.things.forEach((eye, n) => {
        eye.size = $eyeSize
        if (!n) {
          eye.x = width/2 - $faceWidth/1.5
        } else {
          eye.x = width/2 + $faceWidth/1.5
        }
        eye.draw()
      })
    }
  })
})