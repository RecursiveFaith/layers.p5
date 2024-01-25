export default function () {
Layers.create(() => {
  /**
  * This layer adds the black wireframe that holds the glass together
  */
  let defaultColorRange = 10
  let defaultColorOffset = Layers.default.colors[2][0]

  // Common between value
  const onChange = throttle(function (ev) {
    if (ev.presetKey === 'colorRange') {
      Layers.lead.menu.colorRange.default = ev.value
    } else if (ev.presetKey === 'colorOffset') {
      Layers.lead.menu.colorOffset.default = ev.value
    }

    // Update glass layer
    Layers.glass.store[ev.presetKey] = ev.value
    Layers.glass.setup()
    Layers.glass.throttledDraw()

    // Repaint the filter for one frame
    Layers.filter.store.canvas.setBackground(Layers.glass.canvas.elt)
    Layers.filter.store.model.evolving = true
    Layers.filter.store.frames = 90
    Layers.filter.throttledDraw()
    Layers.filter.store.canvas.drawNextFrame()
  }, 100, {trailing: true})

  // Position of cells
  // @see https://www.redblobgames.com/grids/hexagons/#size-and-spacing
  const cells = [
    [0, -2], [1, -1], [1, 1], [0, 2], [-1, 1], [-1, -1],
    [0, -4], [1, -3], [2, -2], [2, 0], [2, 2], [1, 3], [0, 4], [-1, 3], [-2, 2], [-2, 0], [-2, -2], [-1, -3],
  ]

  // const lead = new Layer(opts)
  new Layer({
    id: 'lead',
    noLoop: true,
    
    menu: {
      colorOffset: {min: 0, max: 360, /*default: defaultColorOffset,*/ onChange},
      colorRange: {
        min: 0,
        max: 360,
        // default: defaultColorRange,
        onChange,
      },
      strokeWeight: {min: 1, max: () => minSize * .025},
    },
    
    store: {
      cells: []
    },
    
    setup () {
      $cells = []
      canvas.style.zIndex = 2
    },
    
    draw () {
      // Size of the draw area
      const size = min(width, height, 300)
      let scale
      if (width > height) {
        scale = height / size
      } else {
        scale = width / size
      }
      // The 1.3 is a truly magical number to deal with scaling from glass filter
      let cellSize = min(minSize/16, 300/12) * 1.3
      cellSize *= scale

      // Hex width/height
      const hexW = cellSize
      const hexH = sqrt(3) * hexW/2
      const w = hexW * 3/4 * 2
      const h = hexH
      
      if (width > height) {
        scale = height / size
      } else {
        scale = width / size
      }

      let offsetX = (width - size * scale) / 2
      let offsetY = (height - size * scale) / 2

      // Draw hexes
      clear()
      noStroke()
      push()
      
      // Magical numbers to deal with scaling from glass filter
      translate(w*3, h*5.27)
      translate(offsetX, offsetY)

      // Position within the filters space (we'll scale after)
      // @see Layers.filter
      cells.forEach((cell, n) => {
        strokeWeight($strokeWeight)
        stroke(0)
        fill(255, .01)
        polygon(cell[0]*w, cell[1]*h, cellSize, 6)
      })
      pop()
    }
  })
})
}