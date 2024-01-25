// @fixme make this generic
Layers.ready(() => {
  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')

  

  new Layer({
    id: 'bg',
		colors: ['#FF618B', '#FF9D00', '#FAD000', '#2CA300', '#2EC2B3', '#5D38F0', '#00193D', '#ffffff'],
    colorMode: RGB,
    fps: 10,
    
    menu: {
      bg: {min: 0, max: 7, step: 1, onChange () {this.setup()}},
      fg: {min: 0, max: 7, step: 1, onChange () {this.setup()}},
      frameColor: {min: 0, max: 6, step: 1},
      frameWidth: {min: .0025, max: .02, step: .0001},
      shadow: {min: 50, max: 150},
      dashesBg1: {min: 0, max: .05},
      dashesBg2: {min: 0, max: .05},
      dashesFrame1: {min: 0, max:.05},
      dashesFrame2: {min: 0, max:.05},
    },
    $: {
      scribble: null,
      seed: Date.now(),
      lines: []
    },

    setup () {
      $scribble = new Layers.scribble.$.Scribble()
      $lines = []
      $seed = Date.now()
      if (random() > .5) $fg = $bg

      // Create a grid with lines
      for (let n = 0; n < 1; n++) {
        randomSeed($seed)

        // First pass
        let col = [...this.colors[$fg]]
        col[3] = 50
        
        for (let y = 0; y < height; y += random(minSize*.05)) {
          let col = [...this.colors[$fg]]
          col[0] += random(40, 80)
          col[1] += random(40, 80)
          col[2] += random(40, 80)
          $lines.push({
            x1: 0,
            y1: y,
            x2: width,
            y2: y,
            col,
            strokeWeight: random(6)
          })
        }

        for (let x = 0; x < width; x += random(minSize*.05)) {
          let col = [...this.colors[$fg]]
          col[0] += random(40, 80)
          col[1] += random(40, 80)
          col[2] += random(40, 80)
          $lines.push({
            x1: x,
            y1: 0,
            x2: x,
            y2: height,
            col,
            strokeWeight: random(6)
          })
        }

        for (let y = 0; y < height; y += random(minSize*.05)) {
          let col = [...this.colors[$fg]]
          col[0] += random(40, 80)
          col[1] += random(40, 80)
          col[2] += random(40, 80)
          $lines.push({
            x1: 0,
            y1: y,
            x2: width,
            y2: y,
            col,
            strokeWeight: random(6)
          })
        }

        for (let x = 0; x < width; x += random(minSize*.05)) {
          let col = [...this.colors[$fg]]
          col[0] += random(40, 80)
          col[1] += random(40, 80)
          col[2] += random(40, 80)
          $lines.push({
            x1: x,
            y1: 0,
            x2: x,
            y2: height,
            col,
            strokeWeight: random(6)
          })
        }
      }
    },

    draw () {
      background(this.colors[$bg])
      canvas.drawingContext.setLineDash([minSize*$dashesBg1, minSize*$dashesBg2])

      let col = [...this.colors[$bg]]
      col[3] = 50
      
      drawingContext.shadowOffsetX = -1;
      drawingContext.shadowOffsetY = -1;
      drawingContext.shadowBlur = 3;
      drawingContext.shadowColor = rgbToHex(max(0,col[0]-$shadow), max(0,col[1]-$shadow), max(0,col[2]-$shadow))

      // Paper
      $lines.forEach(line => {
        stroke(line.col)
        strokeWeight(line.strokeWeight)
        $scribble.scribbleLine(line.x1, line.y1, line.x2, line.y2)
      })

      col = [...this.colors[$frameColor]]
      drawingContext.shadowOffsetX = -1;
      drawingContext.shadowOffsetY = -1;
      drawingContext.shadowBlur = 3;
      drawingContext.shadowColor = rgbToHex(max(0,col[0]-$shadow*2), max(0,col[1]-$shadow*2), max(0,col[2]-$shadow*2))
      canvas.drawingContext.setLineDash([minSize*$dashesFrame1, minSize*$dashesFrame2])
      
      // Frame
      push()
        stroke(this.colors[$frameColor])
        const margin = minSize*.1
        strokeWeight(minSize*$frameWidth)
        $scribble.scribbleRect(width/2, height/2, this.width-margin, this.height-margin)
      pop()
    }
  })
}, 'scribble')