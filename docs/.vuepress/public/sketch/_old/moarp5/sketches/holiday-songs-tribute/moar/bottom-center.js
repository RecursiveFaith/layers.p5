/**
 * BOTTOM RIGHT
 */
space.bottomCenter = {
  setup: function () {
    this.moar = new Moar({
      id: 'bottomCenter',
      x: frame.width + col4,
      y: frame.height + row4 * 3,
      width: col4 * 2,
      height: row4,
      bg: 6,
      disableMenu: +params.disableMenu,

      store: {
        trees: []
      },
      
      onSetup (space) {
        // Create a tree (eyes will be created in the last 2 branches)
        for (let i = 0; i < random(30, 60); i++) {
          this.store.trees.push(new Moar.FractalTree({
            x: random(space.width),
            y: this.height,
            moar: space,
            bg: 0,
            shouldGrow: true,
            maxDepth: floor(random(2, 5)),
            growStep: 0,
            leafChance: random(0, .1),
            things: {
              hidden: true,
              scale: {size: 0},
              angle: () => random(-PI / 8, PI / 8),
              pupil: {
                shape: 'random',
                possibleShapes: ['circle', 'vert']
              },
            }
          }))
        }
      }
    })
  },





  /**
   * Expanding rings
  */
  draw: function () {
    this.moar.draw((space, canvas) => {
      canvas.background(color(space.bgColors[space.bg]))
  
      space.store.trees.forEach(tree => {
        tree.draw()
        canvas.drawingContext.shadowColor = 'black'
        canvas.drawingContext.shadowBlur = 10
        canvas.image(tree.canvas, 0, 0, space.width, space.height)
      })
      canvas.drawingContext.shadowBlur = 0
      
      // Frame
      canvas.push()
      canvas.noFill()
      canvas.stroke(colors[6])
      canvas.strokeWeight(_strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, space.width - _strokeWeight / 2, space.height - _strokeWeight / 2)
      canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, space.width - _strokeWeight / 2, space.height - _strokeWeight / 2)

      canvas.rect(-_strokeWeight / 2, -_strokeWeight / 4, space.width - _strokeWeight / 2, space.height - _strokeWeight / 2)
      canvas.rect(_strokeWeight / 2, -_strokeWeight / 4, space.width - _strokeWeight / 2, space.height - _strokeWeight / 2)
      canvas.pop()
    })
  }
}