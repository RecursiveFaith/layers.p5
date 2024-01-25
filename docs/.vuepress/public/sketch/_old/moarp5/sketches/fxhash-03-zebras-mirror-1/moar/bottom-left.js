space.bottomLeft = {
  setup: function () {
    this.moar = new Moar({
      id: 'bottomLeft',
      x: cornerRules[2].x,
      y: cornerRules[2].y,
      width: col4,
      height: row4,
      bg: $fxhashFeatures.isMonochrome ? monochromeColor : floor(random(6)),
      disableMenu: +params.disableMenu,

      /**
       * Create stripes
       */
      onSetup (moar) {
        // Shuffled corner alignment
        let offset = {
          x: ['topRight', 'bottomRight'].includes(cornerRules[2].corner) ? -1 : 1,
          y: ['topLeft', 'topRight'].includes(cornerRules[2].corner) ? -1 : 1
        }

        // Shuffled coner look direction
        switch (cornerRules[2].corner) {
          case 'topLeft':
            offset.angle = HALF_PI
          break
          case 'topRight':
            offset.angle = PI
          break
          case 'bottomRight':
            offset.angle = -HALF_PI
          break
          case 'bottomLeft':
            offset.angle = 0
          break
        }
        
        // Create thing
        let size = min(moar.height, moar.width) * .6
        moar.addThing(moar.width / 2 - moar.width/40*offset.x, moar.height / 2 + moar.height/40*offset.y, size, {
          shape: 'circle',
          pupil: {
            size: random(.2, .8),
          },
          eyelid: {
            top: random(.6, .95),
            bottom: random(.6, .95)
          },
          look: {
            mode: 'restricted',
            timer: 0,
            r: () => random(.25, 1),
            angle: () => (+params.forceLook || random() > .05) ? -HALF_PI/2 + random(-HALF_PI/1.75, HALF_PI/1.75) + offset.angle : random(TWO_PI),
          }
        })
      }
    })
  },





  /**
   * Expanding rings
   */
  draw: function () {
    this.moar.draw((moar, canvas) => {
      const thing = moar.things[0]
      canvas.background(color(moar.bgColors[0]))
  
      // Shuffled coner look direction
      let offset = {
        x: 1,
        y: 1
      }
      switch (cornerRules[2].corner) {
        case 'topLeft':
          offset.y = -1
        break
        case 'topRight':
          offset.x = -1
          offset.y = -1
        break
        case 'bottomRight':
          offset.x = -1
        break
      }

      // Checkered pattern
      let count = 0
      let w = ceil(moar.width / 9)
      let h = moar.height / 9
      let isOdd = (w + 3) % 2

      for (let y = 0; y < h * 1.5; y ++) {
        for (let x = 0; x < w + (isOdd ? 3 : 4); x++) {
          let yShift = frameCount % (h * 2)
          let xShift = frameCount % (w * 2)
          
          if (++count % 2 === 0) {
            canvas.fill(moar.bgColors[moar.bg])
          } else {
            canvas.fill([100, 100, 100])
          }

          canvas.rect(w * x + offset.x*xShift - w * 2, y * h - offset.y*yShift - h * 2, w, h)
        }
      }
 
      // Draw corner
      if ($fxhashFeatures.sameCorners) {
        drawCornerFrame(moar.id, canvas)
      } else {
        drawCornerFrame(cornerRules[2].corner, canvas)
      }
    })
  }
}