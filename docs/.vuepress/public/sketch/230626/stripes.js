Layers.create(() => {
  new Layer({
    id: 'stripes',

		colors: ['#FF618B', '#FF9D00', '#FAD000', '#2CA300', '#2EC2B3', '#5D38F0', '#00193D', '#ffffff'],
    colorMode: RGB,
    fps: 10,

    menu: {
      spacing: {min: 0.0025, max: 0.05},
      stripeWidth: {min: .0025, max: .005, step: .0001},
      dashesBg1: {min: 0, max: .025},
      dashesBg2: {min: 0, max: .025},
    },
    $: {
      scribble: new Layers.scribble.$.Scribble(),
      stripes: [],
    },

    setup () {
      randomSeed(Date.now())
      
      drawingContext.shadowOffsetX = -1;
      drawingContext.shadowOffsetY = -1;
      drawingContext.shadowBlur = 3;
      drawingContext.shadowColor = '#000000fe'

      $stripes = []
      const parallelStripes = []
      const colors = [random(this.colors), random(this.colors)]

      const margin = minSize*.1

      for (let i = 0; i < random(3, 16); i++) {
        $stripes.push({
          x1: random(margin, width-margin),
          x2: random(margin, width-margin),
          y1: random(margin, height-margin),
          y2: random(margin, height-margin),
          color: random(colors),
          numLines: random(1, 6)
        })

        $stripes[i].colors = []
        for (let n = 0; n < $stripes[i].numLines; n++) {
          $stripes[i].colors.push(~~random(2))
        }

        // calculate parallel lines
        // Find the vector from (stripe.x1, stripe.y1) to (stripe.x2, stripe.y2)
        let v = createVector($stripes[i].x2 - $stripes[i].x1, $stripes[i].y2 - $stripes[i].y1)
        // Normalize the vector to get the unit vector
        v.normalize()
        // Scale the vector by some distance (you can change this value)
        // v.mult(minSize*$spacing)
        v.mult(10)
        
        // Create perpindicular
        let u = createVector(-v.y, v.x)

        // Loop through the number of lines
        for (let k = 0; k < $stripes[i].numLines; k++) {
          // Add or subtract the vector from the original points to get the parallel points
          let x1 = $stripes[i].x1 + u.x * (k + 1)
          let y1 = $stripes[i].y1 + u.y * (k + 1)
          let x2 = $stripes[i].x2 + u.x * (k + 1)
          let y2 = $stripes[i].y2 + u.y * (k + 1)
          
          // Add the line
          let newLine = clone($stripes[i])
          newLine.x1 = x1
          newLine.y1 = y1
          newLine.x2 = x2
          newLine.y2 = y2
          newLine.color = random(colors)

          parallelStripes.push(newLine)
        }
      }

      $stripes.push(...parallelStripes)
    },

    draw () {
      clear()
      randomSeed(Date.now())
      canvas.drawingContext.setLineDash([minSize*$dashesBg1, minSize*$dashesBg2])

      // Draw lines
      $stripes.forEach(stripe => {
        push()
        stroke(stripe.color)
        strokeWeight(minSize*$stripeWidth)
        
        // Draw main line
        $scribble.scribbleLine(stripe.x1, stripe.y1, stripe.x2, stripe.y2)
        pop()
      })

      // Refresh texturizer
      if (Layers.texturizer01) {
        Layers.mergeLayers(Layers.texturizer01)
        Layers.texturizer01.draw()
      }
    }
  })
}, ['scribble', 'bg', 'quaternion'])
