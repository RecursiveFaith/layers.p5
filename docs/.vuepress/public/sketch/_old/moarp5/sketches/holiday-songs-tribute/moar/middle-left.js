space.middleLeft = {
  setup: function () {
    this.moar = new Moar({
      id: 'middleLeft',
      x: frame.width,
      y: frame.height + row4,
      width: col4,
      height: row4 * 2,
      bg: 4,

      onSetup (moar) {
        // Create a tree (eyes will be created in the last 2 branches)
        this.store.tree = new Moar.FractalTree({
          x: this.width / 2 - this.width / 4 / 2,
          y: this.height,
          moar,
          bg: 1,
          shouldGrow: true,
          maxDepth: floor(random(2, 5)),
          growStep: 0,
          leafChance: random(.75, 1),
          things: {
            hidden: true,
            scale: {size: 0},
            angle: () => random(-PI / 8, PI / 8),
            pupil: {
              shape: 'random',
              possibleShapes: ['circle', 'vert']
            },
          }
        })
      }
    })
  },

  draw: function () {
    const moar = this.moar
    const canvas = moar.canvas

    moar.draw(() => {
      canvas.background(color(moar.bgColors[moar.bg]))
      // Paste the tree into the canvas
      moar.store.tree.draw()
      canvas.image(moar.store.tree.canvas, 0, 0, moar.width, moar.height)
    })

    // Checkered pattern
    canvas.clear()
    let switched = false
    let w = moar.width / 8
    let h = moar.height / 20

    for (let y = 0; y < moar.height + h * 2; y += h) {
      switched = !switched
      for (let x = 0; x < 2; x++) {
        let yShift = frameCount % ceil(h * 2)
        
        if ((+switched + x) % 2 === 0) {
          canvas.fill(colors[6])
        } else {
          canvas.fill([100, 100, 100])
        }
        
        canvas.rect(moar.width - w * (x + 1), y - yShift, w, h)
      }
    }
    
    // Frame
    canvas.push()
    canvas.noFill()
    canvas.stroke(colors[6])
    canvas.strokeWeight(_strokeWeight)
    canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
    
    canvas.line(moar.width - w * 2, 0, moar.width - w * 2, moar.height)

    canvas.translate(_strokeWeight, _strokeWeight)
    canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
    canvas.pop()

    image(canvas, moar.x, moar.y, moar.width, moar.height)
  }
}