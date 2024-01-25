Layers.ready(() => {
  new Layer({
    id: 'sky',
    
    menu: {
      bg: {min: 4, max: 6, step: 1, resetOnChange: true},
      gridRes: {min: 0.015, max: .025, resetOnChange: true},
      lineWidth: {min: 1, max: 10, step: 1, resetOnChange: true},
      lineLen: {min: 20, max: 120, resetOnChange: true},
    },
    $: {
      isMonochrome: random([true, false]),
      res: 0,
      numCols: 0,
      numRows: 0,
      cellWidth: 0,
      cellHeight: 0,
      field: [],
    },

    setup () {
      $field = []
      background(this.colors[$bg])
      
      // Setup flow field grid
      let x = width * -.5
      let xx = width * 1.5
      let y = height * -.5
      let yy = height * 1.5
      let res = $res = width * $gridRes

      let xSign = random([-1, 1])
      let ySign = random([-1, 1])
      
      $numCols = (xx - x) / res
      $numRows = (yy - y) / res
      $cellWidth = (xx - x) / $numCols
      $cellHeight = (yy - y) / $numRows

      for (let x = 0; x < $numCols; x++) {
        $field.push([])
        for (let y = 0; y < $numRows; y++) {
          let angle = (y*ySign / $numRows + x*xSign / $numCols) * TWO_PI
          $field[x].push({
            angle: angle,
            color: random(this.colors),
            len: random($lineLen),
            lineWidth: random($lineWidth)
          })
        }
      }      


      $field.forEach((row, x) => {
        row.forEach((cell, y) => {
          canvas.strokeWeight(cell.lineWidth)
          canvas.stroke(cell.color)
          canvas.push()
          canvas.translate(x * ($cellWidth), y * ($cellHeight))
          canvas.rotate(cell.angle)
          canvas.line(0, -cell.len/2, 0, cell.len/2)
          canvas.pop()
        })
      })      
    }
  })
})