// @fixme make this generic
Layers.ready(() => {
  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')

  

  new Layer({
    id: 'bg',
		colors: ['#FF618B', '#FF9D00', '#FAD000', '#2CA300', '#2EC2B3', '#5D38F0', '#00193D'],
    colorMode: RGB,
    fps: 10,
    
    menu: {},
    $: {
      scribble: new Layers.scribble.$.Scribble(),
      seed: Date.now(),
      lines: []
    },

    setup () {
      $bg = ~~random(this.colors.length)
      $lines = []
      $seed = Date.now()

      // Create a grid with lines
      for (let n = 0; n < 1; n++) {
        randomSeed($seed)

        // First pass
        let col = [...this.colors[$bg]]
        col[3] = 50
        
        for (let y = 0; y < height; y += random(minSize*.05)) {
          let col = [...this.colors[$bg]]
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
          let col = [...this.colors[$bg]]
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
          let col = [...this.colors[$bg]]
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
          let col = [...this.colors[$bg]]
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

      let col = [...this.colors[$bg]]
      col[3] = 50
      
      drawingContext.shadowOffsetX = -1;
      drawingContext.shadowOffsetY = -1;
      drawingContext.shadowBlur = 3;
      drawingContext.shadowColor = rgbToHex(max(0,col[0]-~~random(-20, 100)), max(0,col[1]-~~random(-20, 100)), max(0,col[2]-~~random(-20, 100)))

      $lines.forEach(line => {
        stroke(line.col)
        strokeWeight(line.strokeWeight)
        $scribble.scribbleLine(line.x1, line.y1, line.x2, line.y2)
      })
    }
  })
}, 'scribble')