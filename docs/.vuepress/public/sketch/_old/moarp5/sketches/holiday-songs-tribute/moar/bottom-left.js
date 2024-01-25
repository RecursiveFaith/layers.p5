space.bottomLeft = {
  setup: function () {
    this.moar = new Moar({
      id: 'bottomLeft',
      x: frame.width,
      y: frame.height + row4 * 3,
      width: col4,
      height: row4,
      bg: 2,
  
      /**
       * Create stripes
       */
      onSetup (moar) {
        // Create thing
        let size = min(moar.height, moar.width) * .6
        moar.addThing(moar.width / 2 - moar.width / 40, moar.height / 2 + moar.height / 40, size, {
          shape: 'circle',
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
      const thing = moar.things[0]
      canvas.background(color(moar.bgColors[0]))
  
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
            canvas.fill(colors[0])
          } else {
            canvas.fill([100, 100, 100])
          }

          canvas.rect(w * x - xShift - w * 2, y * h + yShift - h * 2, w, h)
        }
      }
      
      // Frame
      canvas.push()
      canvas.noFill()
      canvas.stroke(colors[6])
      canvas.strokeWeight(_strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      
      canvas.translate(_strokeWeight, _strokeWeight)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)

      // White corner frame
      canvas.stroke(colors[6])
      canvas.fill(100, 100, 100)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 2, moar.width - _strokeWeight / 2, moar.height / 15)
      canvas.rect(moar.width - _strokeWeight / 4 - moar.width / 15, _strokeWeight / 4 + moar.height / 15, moar.width - _strokeWeight / 2, moar.height - moar.height / 15 - _strokeWeight * 2)

      canvas.noStroke()
      canvas.rect(moar.width + _strokeWeight / 4 - moar.width / 15, _strokeWeight, moar.width - _strokeWeight / 2, moar.height / 15)

      canvas.pop()
    })
  }
}