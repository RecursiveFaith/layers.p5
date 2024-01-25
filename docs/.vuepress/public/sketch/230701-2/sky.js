// Uses Flow Fields to create the clouds
Layers.ready(() => {
  let rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')

	new Layer({
		id: 'clouds',
		colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#eee', '#ddd', '#ccc'],
		noLoop: true,
		
		menu: {
			bg: {min: 4, max: 6, step: 1, resetOnChange: true},
			gridRes: {min: 0.005, max: .05, resetOnChange: true},
			lineWidth: {min: 1, max: 30, step: 1, resetOnChange: true},
			lineLen: {min: 20, max: 120, resetOnChange: true},
			dashesFrame1: {min: 0, max:.015, resetOnChange: true},
			dashesFrame2: {min: 0, max:.015, resetOnChange: true},
			angleMod: {min: 0, max: PI*1.5, step: .01, resetOnChange: true},
		},
		$: {
			isMonochrome: random([true, false]),
			res: 0,
			numCols: 0,
			numRows: 0,
			cellWidth: 0,
			cellHeight: 0,
			field: [],
			scribble: null,
		},

		setup () {
			clear()
			$field = []
			$scribble = new Layers.scribble.$.Scribble()
			canvas.drawingContext.setLineDash([minSize*$dashesFrame1, minSize*$dashesFrame2])

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
					let angle = (y*ySign / $numRows + x*xSign / $numCols) * $angleMod + PI
					$field[x].push({
						angle: angle,
						color: random(this.colors),
						len: random($lineLen),
						lineWidth: random($lineWidth)
					})
				}
			}      

			drawingContext.shadowOffsetX = -1
			drawingContext.shadowOffsetY = -1
			drawingContext.shadowBlur = 3
			drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)'

			$field.forEach((row, x) => {
				row.forEach((cell, y) => {
					strokeWeight(cell.lineWidth)
					stroke(cell.color)
					push()
					translate(x * ($cellWidth), y * ($cellHeight))
					rotate(cell.angle)
					$scribble.scribbleLine(0, -cell.len/2, 0, cell.len/2)
					pop()
				})
			})      
		}
	})
})