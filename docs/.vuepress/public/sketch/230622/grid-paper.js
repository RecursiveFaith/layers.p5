// @fixme make this generic
Layers.ready(() => {
  new Layer({
    id: 'bg',
    // colors: ['#516d99'],
		colors: ['#FF618B', '#FF9D00', '#FAD000', '#2CA300', '#2EC2B3', '#5D38F0', '#00193D'],
    colorMode: RGB,
    
    menu: {},
    $: {
      scribble: new Layers.scribble.$.Scribble()
    },

    setup () {
      $bg = ~~random(this.colors.length)
      
      background(this.colors[$bg])
      
      // Create a grid with lines
      for (let n = 0; n < 1; n++) {
        const seed = Date.now()
        randomSeed(seed)

        // First pass
        let col = [...this.colors[$bg]]
        col[3] = 50

        const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
          const hex = x.toString(16)
          return hex.length === 1 ? '0' + hex : hex
        }).join('')
        
        drawingContext.shadowOffsetX = -1;
        drawingContext.shadowOffsetY = -1;
        drawingContext.shadowBlur = 3;
        drawingContext.shadowColor = rgbToHex(max(0,col[0]-~~random(-20, 100)), max(0,col[1]-~~random(-20, 100)), max(0,col[2]-~~random(-20, 100)))

        for (let y = 0; y < height; y += random(minSize*.05)) {
          let col = [...this.colors[$bg]]
          col[0] += random(40, 80)
          col[1] += random(40, 80)
          col[2] += random(40, 80)
          stroke(col)
          strokeWeight(random(6))
          $scribble.scribbleLine(0, y, width, y)
        }

        for (let x = 0; x < width; x += random(minSize*.05)) {
          let col = [...this.colors[$bg]]
          col[0] += random(40, 80)
          col[1] += random(40, 80)
          col[2] += random(40, 80)
          stroke(col)
          strokeWeight(random(6))
          $scribble.scribbleLine(x, 0, x, height)
        }

        for (let y = 0; y < height; y += random(minSize*.05)) {
          let col = [...this.colors[$bg]]
          col[0] += random(40, 80)
          col[1] += random(40, 80)
          col[2] += random(40, 80)
          stroke(col)
          strokeWeight(random(6))
          $scribble.scribbleLine(0, y, width, y)
        }

        for (let x = 0; x < width; x += random(minSize*.05)) {
          let col = [...this.colors[$bg]]
          col[0] += random(40, 80)
          col[1] += random(40, 80)
          col[2] += random(40, 80)
          stroke(col)
          strokeWeight(random(6))
          $scribble.scribbleLine(x, 0, x, height)
        }
      }
    },

    draw () {}
  })
}, 'scribble')