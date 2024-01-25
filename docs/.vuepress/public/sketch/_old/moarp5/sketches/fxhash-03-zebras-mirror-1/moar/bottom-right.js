/**
 * BOTTOM RIGHT
 */
space.bottomRight = {
  setup: function () {
    this.moar = new Moar({
      id: 'bottomRight',
      x: cornerRules[3].x,
      y: cornerRules[3].y,
      width: col4,
      height: row4,
      bg: $fxhashFeatures.isMonochrome ? monochromeColor : floor(random(6)),
      disableMenu: +params.disableMenu,

      // Settings: Eventually these will be 
      store: {
        spacing: .25,
        speed: .1,
        stripes: [],
        maxScale: 0,
        initSize: 0,
        bg2: 0,

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
        moar.store.bg2 = moar.randomFG()

        // Shuffled corner alignment
        let offset = {
          x: ['topLeft', 'bottomLeft'].includes(cornerRules[3].corner) ? -1 : 1,
          y: ['topLeft', 'topRight'].includes(cornerRules[3].corner) ? -1 : 1
        }

        // Shuffled coner look direction
        switch (cornerRules[3].corner) {
          case 'topLeft':
            offset.angle = PI
          break
          case 'topRight':
            offset.angle = -HALF_PI
          break
          case 'bottomRight':
            offset.angle = 0
          break
          case 'bottomLeft':
            offset.angle = HALF_PI
          break
        }

        const thing = moar.addThing(moar.width / 2 + moar.width/40*offset.x, moar.height / 2 + moar.height/40*offset.y, size, {
          shape: 'circle',
          pupil: {
            shape: 'vert',
            size: random(.1, .3),
          },
          eyelid: {
            top: random(.3, .7),
            bottom: random(.3, .7)
          },
          look: {
            mode: 'restricted',
            timer: 0,
            r: () => random(.25, 1),
            // angle: () => (+params.forceLook || random() > .05) ? PI + random(-PI / 4, PI / 10) : random(TWO_PI),
            angle: () => (+params.forceLook || random() > .05) ? offset.angle + PI + HALF_PI/2 + random(-HALF_PI/2, HALF_PI/2) : random(TWO_PI),
          }
        })
        this.store.stripes = []
        this.store.initSize = thing.size
        
        // Rainbow stripes
        let scale = 0
        let loops = moar.store.spacing
        loops = max(moar.width, moar.height) / (moar.store.spacing * thing.size)
        loops = ceil(loops) + 1
        
        // Background colors
        let bgColors = [...moar.bgColors]
        let bg1 = bgColors[moar.bg]
        let bg2 = bgColors[moar.store.bg2]
        if ($fxhashFeatures.isMonochrome) {
          bg2 = [...bg1]
          bg2[2] += 1
        }

        for (let j = 0; j < loops; j++) {
          for (let i = 1; i < 3; i++) {
            const stripe = {
              canvas: this.canvas,
              colorMode: [HSL, 360, 1, 1, 1],
              size: scale * (moar.store.spacing * thing.size),
              fill: i === 1 ? bg1 : bg2,
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

      // Draw corner
      if ($fxhashFeatures.sameCorners) {
        drawCornerFrame(moar.id, canvas)
      } else {
        drawCornerFrame(cornerRules[3].corner, canvas)
      }
    })
  }
}