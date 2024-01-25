/**
 * TOP CENTER
 */
 space.topCenter = {
  setup: function () {
    let bgColors = [[...colors[0]], [355, 100, 100]]

    this.moar = new Moar({
      id: 'topCenter',
      x: frame.width + col4,
      y: frame.height,
      width: col4 * 2,
      height: row4,
      bg: 0,
      bgColors,
    
      // Settings: Eventually these will be 
      store: {
        scaleSpeed: 500,
        scaleRange: {min: .25, max: 2},
      },
    
      /**
       * Create stripes
       */
      onSetup (moar) {
        // Create thing
        let size = min(moar.height, moar.width) * .8
        moar.addThing(moar.width / 2, moar.height / 2, size, {
          iris: {
            color: 0
          },
          eyelid: {
            top: random(.7, .9),
            bottom: random(.4, .9)
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
      canvas.background(color(moar.bgColors[moar.bg]))
  
      // Scale
      thing.scale.size = map(sin(TWO_PI * (frameCount + 180) / moar.store.scaleSpeed), -1, 1, moar.store.scaleRange.min, moar.store.scaleRange.max)
  
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