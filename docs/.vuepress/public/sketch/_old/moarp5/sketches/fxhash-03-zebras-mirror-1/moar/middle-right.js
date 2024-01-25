space.middleRight = {
  setup: function () {
    this.moar = new Moar({
      id: 'middleRight',
      x: frame.width + col4 * 3,
      y: frame.height + row4,
      disableMenu: +params.disableMenu,
      width: col4,
      height: row4 * 2,
      bg: $fxhashFeatures.isMonochrome ? monochromeColor : floor(random(6)),
      customBg: {
        type: random(['triangles', 'circles']),
      },

      onSetup (moar) {
        // Create a tree (eyes will be created in the last 2 branches)
        this.store.tree = new Moar.FractalTree({
          x: this.width / 2 + this.width / 4 / 2,
          y: this.height,
          bg: $fxhashFeatures.isMonochrome ? monochromeColor : floor(random(this.bgColors.length)),
          moar,
          shouldGrow: !+params.skipGrow,
          maxDepth: floor(random(2, 5)),
          growStep: 0,
          sizeMod: random(.4, 2),
          leafChance: random(.25, .65),
          things: {
            // hidden: true,
            // scale: {size: 0},
            angle: () => random(-PI / 8, PI / 8),
            pupil: {
              shape: 'random',
              possibleShapes: ['circle', 'vert']
            },
            look: {
              mode: 'restricted',
              timer: 0,
              r: () => random(0, 1),
              angle: () => (+params.forceLook || random() > .05) ? PI + random(-HALF_PI, HALF_PI) : random(TWO_PI),
            }
          }
        })
      }
    })
  },

  draw: function () {
    const space = this.moar
    const canvas = space.canvas

    space.draw(() => {
      space.background()

      // Paste the tree into the canvas
      space.store.tree.draw()
      canvas.image(space.store.tree.canvas, 0, 0, space.width, space.height)
    })
      
    // Checkered pattern
    canvas.clear()
    let switched = false
    let w = space.width / 8
    let h = space.height / 20

    for (let y = 0; y < space.height + h * 2; y += h) {
      switched = !switched
      for (let x = 0; x < 2; x++) {

        let yShift = frameCount % (h * 2)
        
        if ((+switched + x) % 2 === 0) {
          canvas.fill(colors[6])
        } else {
          canvas.fill([100, 100, 100])
        }

        canvas.rect(w * x, y + yShift - h * 2, w, h)
      }
    }
    
    // Frame
    canvas.push()
    canvas.noFill()
    canvas.stroke(colors[6])
    canvas.strokeWeight(_strokeWeight)
    canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, space.width - _strokeWeight / 2, space.height - _strokeWeight / 2)
    
    canvas.line(w * 2, 0, w * 2, space.height)

    canvas.translate(-_strokeWeight, _strokeWeight)
    canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, space.width - _strokeWeight / 2, space.height - _strokeWeight / 2)
    canvas.pop()

    image(canvas, space.x, space.y, space.width, space.height)
  }
}