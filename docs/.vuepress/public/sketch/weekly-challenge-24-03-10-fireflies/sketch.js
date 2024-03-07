Layers.ready(() => {
  new Layer({
    id: 'base',
    
    menu: {},
    $: {},
    colorMode: RGB,
    renderer: WEBGL,

    setup () {
      background(0)

      // Background
      brush.load(this.canvas)
      brush.noStroke()
      brush.fill(50, 50, 155, 255)
      brush.rect(-width/1.5, -height/1.5, width*1.5, height*1.5)
      brush.fill(0, 0, 0, 255)
      brush.rect(-width/1.5, -height/1.5, width*1.5, height*1.5)

      // Moon
      brush.fill(255, 255, 255, 255)
      brush.circle(random(-width/2, width/2), -height/2, random(minSize/10, minSize/4))

      // random grass in foreground
      for (let n = 0; n < 3; n++) {
        let grassCount = 150-n*30
        for (let i = 0; i < grassCount; i++) {
          brush.stroke(random(10, 40)+n*8, random(30, 60)+n*12, 0)
          brush.strokeWeight(random(minSize*.0025, minSize*.025))
          brush.flowLine(width/2-i/grassCount*width, height/2, random(minSize*.15, minSize*.5)-n*minSize*.05, PI*.5+random(-PI*.25, PI*.25), random(-PI*.25, PI*.25))
        }
      }

      // random amount of fireflies as circles
      const fireflies = []
      brush.noStroke()
      for (let i = 0; i < random(25, 50); i++) {
        const x = random(-width/1.75, width/1.75)
        const y = random(-height/1.75, height/1.75)
        const size = random(minSize*.005, minSize*.025)

        const col = random(150, 255) 
        
        for (let j = 0; j < 3; j++) {
          brush.fill(col+j*10, col+j*10, j*90, random(100, 255))
          brush.circle(x, y, size - j*minSize*.0025)
        }

        fireflies.push({x, y, size})
      }

      fireflies.forEach(({x, y, size}) => {
        // Firefly effects
        switch (~~random(4)) {
          // Glow with rings
          case 1:
            brush.field('seabed')
            brush.field('curved')
            brush.noFill()
            
            // Translate to firefly position
            for (let k = 0; k < ~~random(4, 20); k++) {
              let r = size + random(minSize * 0.01, minSize * 0.05)
              let startAngle = random(PI*2)
              let endAngle = startAngle + random(PI)
      
              if (random(6) > 2) {
                const col = random(155, 255)
                brush.stroke(col, col, 0)
                brush.strokeWeight(random(3, 9))
                brush.pick('pen')
              } else {
                const col = random(100, 200) 
                brush.stroke(col, col, 0)
                brush.strokeWeight(random(1, 6))
                brush.pick('spray')
              }
      
              brush.arc(x, y, r, startAngle, endAngle)
            }
          break
        }
      })

      brush.reDraw()
      brush.reBlend()
    },

    draw () {
    }
  })
})