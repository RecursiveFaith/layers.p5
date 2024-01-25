space.topRight = {
  setup: function () {
    // Extract the yellow out, then shift hue shift slightly
    let col = $fxhashFeatures.isMonochrome ? monochromeColor : floor(random(6))
    let sunColor = [...colors[col]]
    let bgColors = [[...sunColor]]

    // Darken and lighten (Must be odd number)
    let steps = 5
    for (let i = 0; i < steps; i++) {
      if (i < steps / 2) {
        sunColor[2] += $fxhashFeatures.isMonochrome ? .2 : -.06
      } else {
        sunColor[2] += $fxhashFeatures.isMonochrome ? -.21 : .06
      }
      bgColors.push([...sunColor])
    }
    
    this.moar = new Moar({
      id: 'topRight',
      x: cornerRules[1].x,
      y: cornerRules[1].y,
      width: col4,
      height: row4,
      bgColors,
      disableMenu: +params.disableMenu,

      // Settings: Eventually these will be 
      store: {
        spacing: .2,
        speed: .1,
        stripes: [],
        maxScale: 0,
        initSize: 0,
    
        shouldScale: true,
        scaleSpeed: 500,
        scaleRange: {min: .575, max: .8},
        sunColor
      },
    
      /**
       * Create stripes
       */
      onSetup (moar) {
        // Shuffled corner alignment
        let offset = {
          x: ['topLeft', 'bottomLeft'].includes(cornerRules[1].corner) ? -1 : 1,
          y: ['bottomLeft', 'bottomRight'].includes(cornerRules[1].corner) ? -1 : 1
        }

        // Shuffled coner look direction
        switch (cornerRules[1].corner) {
          case 'topLeft':
            offset.angle = -HALF_PI
          break
          case 'topRight':
            offset.angle = 0
          break
          case 'bottomRight':
            offset.angle = HALF_PI
          break
          case 'bottomLeft':
            offset.angle = PI
          break
        }
        
        let size = min(moar.height, moar.width) * .8
        moar.addThing(moar.width / 2 + moar.width/40*offset.x, moar.height / 2 - moar.height/40*offset.y, size, {
          shape: 'circle',
          pupil: {
            size: .7,
            shape: 'vert',
            size: .25
          },
          iris: {
            color: 1,
          },
          eyelid: {
            top: 1,
            bottom: 1,
          },
          look: {
            mode: 'restricted',
            timer: 0,
            r: () => random(.25, 1.5),
            angle: () => (+params.forceLook || random() > .05) ? offset.angle + PI - HALF_PI/2 + random(-HALF_PI/2.25, HALF_PI/4) : random(TWO_PI),
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
      canvas.background(moar.store.sunColor)
  
      // Scale
      thing.scale.size = map(sin(TWO_PI * (frameCount + 180) / moar.store.scaleSpeed), -1, 1, moar.store.scaleRange.min, moar.store.scaleRange.max)

      // Scaling stripes
      canvas.push()
      canvas.translate(thing.x, thing.y)
      let loops = ceil(max(moar.width, moar.height) / (moar.store.spacing * thing.size) * 2) + 1
      let numColors = moar.bgColors.length

      for (let i = loops + 1; i > 0; i--) {
        const stripe = {
          size: max(0,
            thing.size * moar.store.spacing * (i - loops / 2)
            //             👇 This is the number of frames it takes to do a full loop,
            //                so lets use a multiple of this number as the metronome for recording loop videos
            + frameCount % floor(numColors * thing.size * moar.store.spacing)
          ),
          colorMode: moar.colorMode,
          fill: moar.bgColors[i % numColors],
          canvas
        }
        // thing.drawWhites(1, 1, stripe)
        canvas.fill(moar.bgColors[i % numColors])
        Moar.shape.star(canvas, 0, 0, stripe.size / 1.75, stripe.size / 2, 10)
      }

      // Star
      let eyelidColor = [...this.moar.store.sunColor]
      eyelidColor[2] = max(0, eyelidColor[2] - .1)
      canvas.fill(eyelidColor)
      canvas.rotate(frameCount * .005)
      Moar.shape.star(canvas, 0, 0, thing.size * thing.scale.size / 1.75, thing.size * thing.scale.size / 1.5, 10)

      canvas.pop()
  
      // Draw corner
      if ($fxhashFeatures.sameCorners) {
        drawCornerFrame(moar.id, canvas)
      } else {
        drawCornerFrame(cornerRules[1].corner, canvas)
      }
    })
  }
}