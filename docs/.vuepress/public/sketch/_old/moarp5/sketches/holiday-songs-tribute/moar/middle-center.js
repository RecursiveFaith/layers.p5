space.middleCenter = {
  setup: function () {
    this.moar = new Moar({
      id: 'middleCenter',
      x: frame.width + col4,
      y: frame.height + row4,
      width: col4 * 2,
      height: row4 * 2,
      bg: 6,
      
      /**
       * Create stripes
       */
      onSetup (moar) {
        let size = min(moar.height, moar.width) * .8

        moar.addThing(moar.width / 2, moar.height / 2, size, {
          pupil: {
            size: random(.2, .8),
          },
          iris: {
            color: 3,
          },
          eyelid: {
            top: random(.6, .95),
            bottom: random(.6, .95)
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
      canvas.background(color(moar.bgColors[moar.bg]))
  
      // Frame
      canvas.push()
      canvas.noFill()
      canvas.stroke(colors[6])
      canvas.strokeWeight(_strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      canvas.pop()
    })
  }
}