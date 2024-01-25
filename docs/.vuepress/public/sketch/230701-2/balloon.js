Layers.ready(() => {
	new Layer({
		id: 'balloon',
    colors: ['#f00', '#c00', '#a00', '#f77', '#f33'],
		colorMode: RGB,
		fps: 10,
		noLoop: true,

		menu: {
			bg: {min: 0, max: 5, step: 1, resetOnChange: true},
			fg: {min: 0, max: 5, step: 1, resetOnChange: true},
			shadow: {min: 50, max: 150},
		},
		$: {
			scribble: null,
			seed: Date.now(),
			balloons: []
		},

		setup () {
			$scribble = new Layers.scribble.$.Scribble()
			$balloons = []

			for (let i = 0; i < random(1, 10); i++) {
				// Generate xCoords and yCoords for the balloon
				$balloons.push({
					x: random(width),
					y: random(height),
					size: random(.015, .3),
					detail: random(4, 20),
					color: this.colors[~~random(0, 5)],
					angle: random(-PI/6, PI/6),
				})
			}

			drawingContext.shadowOffsetX = -1
			drawingContext.shadowOffsetY = -1
			drawingContext.shadowBlur = 3
			drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)'

			clear()
			$balloons.forEach(balloon => {
				if (random() > .5) {
					canvas.drawingContext.setLineDash([minSize*random(0.015)])
				} else {
					canvas.drawingContext.setLineDash([0])
				}
				
				stroke(balloon.color)
				let xCoords = []
				let yCoords = []
				let stitchXCoords = []
				let stitchYCoords = []
				
				strokeWeight(random(1, 4))
				let hasStitching = random() > .75
				for (let i = 0; i < PI*2; i+=PI/balloon.detail) {
					// The balloon fill
					xCoords.push(cos(i) * balloon.size * minSize)
					yCoords.push(sin(i) * balloon.size * 1.2 * minSize)
					
					// The border stitching
					if (hasStitching) {
						let len = random(.85, .9)
						stitchXCoords.push(cos(i) * balloon.size * minSize * len)
						stitchYCoords.push(sin(i) * balloon.size * 1.2 * minSize * len)					
					}
				}
				
        
        push()
          // Draw the fill
          translate(balloon.x, balloon.y)
          rotate(balloon.angle)
          $scribble.scribbleFilling(xCoords, yCoords, random(1, 10), random(PI*2))
          stroke(255)

          // Draw the stitching
          strokeWeight(random(1, 3))
          stitchXCoords.forEach((x, i) => {
            let nextX = stitchXCoords[i+1] || stitchXCoords[0]
            let nextY = stitchYCoords[i+1] || stitchYCoords[0]
            
            $scribble.scribbleLine(x, stitchYCoords[i], nextX, nextY, ~~random(1, 4))
          })
				pop()
			})
		},

		draw () {

		}
	})	
})