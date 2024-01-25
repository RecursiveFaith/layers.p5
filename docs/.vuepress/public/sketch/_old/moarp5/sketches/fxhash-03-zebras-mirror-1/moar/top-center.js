/**
 * TOP CENTER
 */
 space.topCenter = {
  setup: function () {
    let bgColors

    if ($fxhashFeatures.isMonochrome) {
      bgColors = [[...colors[monochromeColor]], [355, 100, 100]]
    } else {
      bgColors = [[...colors[floor(random(6))]], [355, 100, 100]]
    }
    
    this.moar = new Moar({
      id: 'topCenter',
      x: frame.width + col4,
      y: frame.height,
      width: col4 * 2,
      height: row4,
      bg: 0,
      bgColors,
      disableMenu: +params.disableMenu,
    
      // Settings: Eventually these will be 
      store: {
        scaleSpeed: 500,
        scaleRange: {min: .25, max: 2},

        spacing: .5,
        speed: .1,
        stripes: [],
        maxScale: 0,
        initSize: 0,
  
        shouldScale: true,
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
        let thing = moar.addThing(moar.width / 2, moar.height / 2, size, {
          iris: {
            color: 0
          },
          eyelid: {
            top: random(.7, .9),
            bottom: random(.4, .9)
          },
          look: {
            mode: 'restricted',
            timer: 0,
            r: () => random(0, .5),
            angle: () => (+params.forceLook || random() > .05) ? random(-HALF_PI/8, PI + HALF_PI/8) : random(TWO_PI),
          }
        })

        // Rings
        this.store.stripes = []
        this.store.initSize = thing.size
        
        // Rainbow stripes
        let scale = 0
        let loops = moar.store.spacing
        loops = max(width, height) / (moar.store.spacing * thing.size)
        loops = ceil(loops)
        
        for (let j = 0; j < loops; j++) {
          for (let i = 0; i < moar.colors.length; i++) {
            moar.store.stripes.push({
              canvas: this.canvas,
              colorMode: [HSL, 360, 1, 1, 1],
              size: scale * (moar.store.spacing * thing.size),
              fill: moar.colors[i],
              x: thing.x,
              y: thing.y
            })
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
      canvas.background(color(moar.bgColors[moar.bg]))
  
      // Scale
      thing.scale.size = map(sin(TWO_PI * (frameCount + 180) / moar.store.scaleSpeed), -1, 1, moar.store.scaleRange.min, moar.store.scaleRange.max)
  
      if ($fxhashFeatures.isPsychedelic) {
        // Update stripes
        moar.store.stripes.forEach(stripe => {
          thing.drawWhites(1, 1, stripe)
          stripe.size += moar.store.initSize * moar.store.spacing * moar.store.speed
        })

        // Recycle the stripes when they grow too big
        moar.store.stripes.forEach(stripe => {
          if (stripe.size > moar.store.maxScale * (moar.store.spacing * thing.size)) {
            stripe.size = 0
            moar.store.stripes.push(moar.store.stripes.shift())
          }
        })
      } else {
        // Stripes
        let radius = max(moar.width, moar.height) * 2
        let numStripes = 18
        let isFilled = false
        let step = 360 / numStripes
        for (let i = 0; i < 360; i += step) {
          isFilled = !isFilled
          canvas.fill(isFilled ? moar.bgColors[0] : moar.bgColors[1])
          
          let x = thing.x + cos(radians(i + frameCount / 2)) * radius
          let xx = thing.x + cos(radians((i + step) + frameCount / 2)) * radius
          let y = thing.y + sin(radians(i + frameCount / 2)) * radius
          let yy = thing.y + sin(radians((i + step) + frameCount / 2)) * radius
          canvas.triangle(thing.x, thing. y, x, y, xx, yy)
        }
      }

      // Frame
      canvas.push()
      canvas.noFill()
      canvas.noFill()
      canvas.stroke(colors[6])
      canvas.strokeWeight(_strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      
      canvas.translate(0, _strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      canvas.pop()
    })
  }
}