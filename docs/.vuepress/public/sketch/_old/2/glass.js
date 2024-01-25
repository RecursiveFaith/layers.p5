export default function () {
Layers.create(() => {
  /**
  * This Layer draws the hexagon tiles for Watercanvas
  */
  let defaultColorRange = 10
  let defaultColorOffset = Layers.default.colors[2][0]

  // 1.3 is a magical number 🧙‍♂️
  const cellSize = min(minSize/16, 300/12) * 1.3

  // Position of hexes
  // @see https://www.redblobgames.com/grids/hexagons/#size-and-spacing
  const cells = [
    [0, -2], [1, -1], [1, 1], [0, 2], [-1, 1], [-1, -1],
    [0, -4], [1, -3], [2, -2], [2, 0], [2, 2], [1, 3], [0, 4], [-1, 3], [-2, 2], [-2, 0], [-2, -2], [-1, -3],
  ]

  // When menu changes, we also need to update the Canvas layer
  const onChange = throttle(function (ev) {
    if (ev.presetKey === 'colorRange') {
      Layers.glass.menu.colorRange.default = ev.value
    } else if (ev.presetKey === 'colorOffset') {
      Layers.glass.menu.colorOffset.default = ev.value
    }
    
    this.setup()
    this.throttledDraw()

    // Repaint the filter for one frame
    Layers.filter.store.canvas.setBackground(this.canvas.elt)
    Layers.filter.store.model.evolving = true
    Layers.filter.store.frames = 90
    Layers.filter.throttledDraw()
    Layers.filter.store.canvas.drawNextFrame()
  }, 100, {trailing: true})

  /**
   * Create the glass
   */
  new Layer({
    id: 'glass',
    noLoop: true,
    menuDisabled: true,
    
    menu: {
      colorOffset: {min: 0, max: 360, /*default: defaultColorOffset,*/ onChange},
      colorRange: {
        min: 0,
        max: 360,
        // default: defaultColorRange,
        onChange,
      },
      strokeWeight: {min: 1, max: minSize * .025},
    },
    
    store: {
      cells: []
    },
    
    setup () {
      $cells = []
      
      cells.forEach(cell => {
        const col = [...this.colors[2]]
        col[0] = wrap($colorOffset + random(-$colorRange, $colorRange), 0, 359)
        col[3] = random(.5, .8)
        
        $cells.push({
          fill: col
        })
      })
    },
    
    afterGenerate () {
      this.canvas.elt.style.visibility = 'hidden'
    },
    
    draw () {
      // Hex width/height
      const hexW = cellSize
      const hexH = sqrt(3) * hexW/2
      const w = hexW * 3/4 * 2
      const h = hexH
      
      // Draw hexes
      clear()
      noStroke()
      push()
      
      // Magical numbers to deal with scaling from glass filter
      translate(w*3, h*5.27)

      // Position within the filters space (we'll scale after)
      // @see Layers.filter
      cells.forEach((cell, n) => {
        fill($cells[n].fill)
        polygon(cell[0]*w, cell[1]*h, ceil(cellSize), 6)
      })
      pop()
    }
  })
})
}