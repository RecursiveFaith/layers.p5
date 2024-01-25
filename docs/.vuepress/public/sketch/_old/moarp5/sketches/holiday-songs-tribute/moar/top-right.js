space.topRight = {
  setup: function () {
    // Extract the yellow out, then shift hue shift slightly
    let sunColor = [...colors[2]]
    let bgColors = [[...sunColor]]

    // Darken and lighten (Must be odd number)
    let steps = 5
    for (let i = 0; i < steps; i++) {
      if (i < steps / 2) {
        sunColor[2] -= .04
      } else {
        sunColor[2] += .04
      }
      bgColors.push([...sunColor])
    }
    
    this.moar = new Moar({
      id: 'topRight',
      x: frame.width + col4 * 3,
      y: frame.height,
      width: col4,
      height: row4,
      bg: 1,
      bgColors,

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
      },
    
      /**
       * Create stripes
       */
      onSetup (moar) {
        let size = min(moar.height, moar.width) * .8
        moar.addThing(moar.width / 2 + moar.width / 40, moar.height / 2 - moar.height / 40, size, {
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
      let eyelidColor = [...this.moar.colors[this.moar.bg]]
      eyelidColor[2] = max(0, eyelidColor[2])
      canvas.fill(eyelidColor)
      canvas.rotate(frameCount * .005)
      Moar.shape.star(canvas, 0, 0, thing.size * thing.scale.size / 1.75, thing.size * thing.scale.size / 1.5, 10)

      canvas.pop()
  
      // Frame
      canvas.push()
      canvas.noFill()
      canvas.stroke(colors[6])
      canvas.strokeWeight(_strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      
      canvas.translate(-_strokeWeight, _strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
 
      // White corner frame
      canvas.stroke(colors[6])
      canvas.fill(100, 100, 100)
      canvas.rect(_strokeWeight, _strokeWeight / 4, moar.width / 15, moar.height - moar.height / 15 - _strokeWeight * 1.5)
      canvas.rect(_strokeWeight, moar.height - moar.height / 15 - _strokeWeight, moar.width - _strokeWeight, moar.height / 15)
 
      canvas.noStroke()
      canvas.rect(_strokeWeight * 1.5, moar.height - moar.height / 15 - _strokeWeight * 2, moar.width / 15 - _strokeWeight, moar.height / 15)

      canvas.pop()
    })
  }
}