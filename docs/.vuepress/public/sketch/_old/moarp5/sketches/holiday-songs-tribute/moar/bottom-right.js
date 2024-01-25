/**
 * BOTTOM RIGHT
 */
space.bottomRight = {
  setup: function () {
    let bgColors = [[...colors[0]], [...colors[2]], [...colors[3]]]

    this.moar = new Moar({
      id: 'bottomRight',
      x: frame.width + col4 * 3,
      y: frame.height + row4 * 3,
      width: col4,
      height: row4,
      bg: 0,
      bgColors,
    
      // Settings: Eventually these will be 
      store: {
        spacing: .25,
        speed: .1,
        stripes: [],
        maxScale: 0,
        initSize: 0,
    
        shouldScale: true,
        scaleSpeed: 500,
        scaleRange: {min: .575, max: .8},
    
        shouldRotate: false,
        rotateSpeed: 360,
        rotateAmount: PI / 12,
      },
    
      /**
       * Create stripes
       */
      onSetup (moar) {
        // Create thing
        let size = min(moar.height, moar.width) * .8

        const thing = moar.addThing(moar.width / 2 + moar.width / 40, moar.height / 2 + moar.height / 40, size, {
          shape: 'circle',
          pupil: {
            shape: 'vert',
            size: random(.1, .3),
          },
          iris: {
            color: 2,
          },
          eyelid: {
            top: random(.3, .7),
            bottom: random(.3, .7)
          }
        })
        this.store.stripes = []
        this.store.initSize = thing.size
        
        // Rainbow stripes
        let scale = 0
        let loops = moar.store.spacing
        loops = max(moar.width, moar.height) / (moar.store.spacing * thing.size)
        loops = ceil(loops) + 1
        
        for (let j = 0; j < loops; j++) {
          for (let i = 1; i < 3; i++) {
            const stripe = {
              canvas: this.canvas,
              colorMode: [HSL, 360, 1, 1, 1],
              size: scale * (moar.store.spacing * thing.size),
              fill: moar.bgColors[i],
              x: thing.x,
              y: thing.y
            }

            // This will be the stroke
            const edge = Object.assign({}, stripe)
            edge.fill = colors[6]
            edge.colorMode = moar.colorMode
            stripe.edge = edge
            edge.size = stripe.size * 1.05

            moar.store.stripes.push(stripe)
            scale++
          }
        }
        moar.store.maxScale = scale
        moar.store.stripes = moar.store.stripes.reverse()
      }
    })
  },





  /**
   * Expanding rings
   */
  draw: function () {
    this.moar.draw((moar, canvas) => {
      const thing = moar.things[0]
  
      // Scale
      thing.scale.size = map(sin(TWO_PI * (frameCount + 180) / moar.store.scaleSpeed), -1, 1, moar.store.scaleRange.min, moar.store.scaleRange.max)
  
      // Update stripes
      moar.store.stripes.forEach((stripe, n) => {
        if (n < moar.store.stripes.length - 1) {
          thing.drawWhites(1, 1, stripe.edge)
        }
        thing.drawWhites(1, 1, stripe)
        stripe.size += moar.store.initSize * moar.store.spacing * moar.store.speed
        stripe.edge.size = stripe.size * 1.05
      })
  
      // Recycle the stripes when they grow too big
      moar.store.stripes.forEach(stripe => {
        if (stripe.size > moar.store.maxScale * (moar.store.spacing * thing.size)) {
          stripe.size = 0
          moar.store.stripes.push(moar.store.stripes.shift())
        }
      })

      // Frame
      canvas.push()
      canvas.noFill()
      canvas.stroke(colors[6])
      canvas.strokeWeight(_strokeWeight)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      canvas.rect(-_strokeWeight / 4, -_strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      
      canvas.translate(-_strokeWeight, _strokeWeight)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
    
      // White corner frame
      canvas.stroke(colors[6])
      canvas.fill(100, 100, 100)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 2, moar.width - _strokeWeight / 4, moar.height / 15)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4 + moar.height / 15, moar.width / 15 - _strokeWeight / 2, moar.height - moar.height / 15 - _strokeWeight * 2)

      canvas.noStroke()
      canvas.rect(_strokeWeight / 4, _strokeWeight, moar.width / 15 - _strokeWeight, moar.height / 15)
    
      canvas.pop()
    })
  }
}