Layers.ready(() => {
  new Layer({
    id: 'sketch',
    colorMode: RGB,
    renderer: WEBGL,

    setup () {
      background(0)
      brush.load(this.canvas)
      brush.noStroke()
      brush.noField()

      // Jar placement
      const jarWidth = random(minSize*.25, minSize*.45)
      const jarHeight = random(minSize*.45, minSize*.75)
      const jarX = random(-width/2, 0)
      const jarY = random(height/3, height/1.5)-jarHeight/2

      
      // Fullscreen watercolor
      // - Creates the effect of mountains and clouds
      brush.fill(50, 50, random(155, 200), 255)
      brush.rect(-width/1.5, -height/1.5, width*1.5, height*1.5)
      brush.fill(0, 0, random(0, 10), 255)
      brush.rect(-width/1.5, -height/1.5, width*1.5, height*1.5)

      // Moon
      const moonSize = random(minSize/10, minSize/4)
      const moonX = random(-width/2, width/2)
      brush.fill(255, 255, 255, 255)
      brush.circle(moonX, -height/2, moonSize)

      // Moon rings
      brush.noField()
      brush.noFill()
      let maxRingDist = random()>.8 ? random(minSize*.15, minSize*.35) : random(minSize*.15)
      for (let i = 0; i < ~~random(50, 300); i++) {
        let r = moonSize + random(minSize*0.01, minSize*0.15 + maxRingDist)
        let startAngle = random(-PI*.1, PI+PI*.1)
        let endAngle = startAngle + random(PI*.1, PI*.75)

        const col = random() > .8 ? random(150, 225) : random(80, 120)
        brush.stroke(col, col, col + random(100))
        brush.strokeWeight(max(1, random(minSize*0.001, minSize*0.025)))

        if (random() > .5) {
          brush.pick('pen')
        } else {
          brush.pick('marker2')
        }

        brush.arc(moonX, -height/2, r, startAngle, endAngle)
      }



      // Grass
      // - n "layers" of grass
      // - each layer gets shorter but brighter
      // - occasionally a blade will catch the light as yellow
      brush.field('seabed')
      brush.field('curved')
      for (let n = 0; n < 3; n++) {
        let grassCount = 200-n*30
        for (let i = 0; i < grassCount; i++) {
          if (!n && random()>.25) {
            brush.pick('marker')
          } else {
            brush.pick('pen')
          }
          brush.strokeWeight(random(minSize*.0025, minSize*.025))
          
          if (n < 2 && random(25) < 1) {
            const col = random(100, 200)
            brush.stroke(col, col, 0)
          } else {
            brush.stroke(random(10, 40)+n*8, random(30, 60)+n*12, 0)
          }

          const initAngle = PI*.5+random(-PI*.25, PI*.25)
          brush.beginStroke('curve', width/2-i/grassCount*width, height/2)
          brush.segment(initAngle, random(minSize*.15, minSize*.5)-n*minSize*.075, 1)
          brush.endStroke(initAngle + random(-PI*.35, PI*.35))
        }
      }



      // Normal Fireflies
      // - some will glow
      // - illuminates environment dust
      const fireflies = []
      brush.noStroke()
      for (let i = 0; i < random(80, 200); i++) {
        const x = random(-width/1.75, width/1.75)
        const y = random(-height/1.75, height/1.75)
        let size = random() > .75 ? random(minSize*.005, minSize*.025) : random(minSize*.0025, minSize*.015)

        // Paint the spots 
        const col = random(150, 255) 
        for (let j = 0; j < 3; j++) {
          brush.fill(col+j*10, col+j*10, j*90, random(100, 255))
          brush.circle(x, y, size - j*minSize*.0025)
        }

        if (size > minSize*.01) {
          fireflies.push({x, y, size})
        }
      }





      // Glass jar
      const jarOpacity = random(60, 150)
      brush.pick('pen')
      brush.fill(155, 155, 255, jarOpacity)
      
      // body
      // border
      brush.noField()
      brush.stroke(50+jarOpacity, 50+jarOpacity, 50+jarOpacity)
      brush.strokeWeight(max(1, random(minSize*.001, minSize*.005)))
      brush.rect(jarX, jarY, jarWidth, jarHeight)
      brush.strokeWeight(max(1, random(minSize*.001, minSize*.005)))
      brush.rect(jarX, jarY, jarWidth, jarHeight)

      // fill
      brush.noStroke()
      brush.rect(jarX, jarY, jarWidth, jarHeight)

      // lid
      const lidWidth = jarWidth*random(.6, .9)
      const lidHeight = jarHeight*random(.15, .3)
      brush.stroke(50+jarOpacity, 50+jarOpacity, 50+jarOpacity)
      brush.rect(jarX+(jarWidth-lidWidth)/2, jarY-lidHeight*1.0, lidWidth, lidHeight)
      brush.rect(jarX+(jarWidth-lidWidth)/2, jarY-lidHeight*1.0, lidWidth, lidHeight)

      // White moon reflection lines inside jar
      brush.stroke(255, 255, 255)

      // left side reflections
      for (let y = 0; y < random(0, 3); y++) {
        let reflectionY = random(jarY, jarY+jarHeight*.8)
        for (let n = 0; n < random(5, 10); n++) {
          if (random() > .5) {
            brush.pick('marker2')
            brush.strokeWeight(random(1, 2))
          } else {
            brush.pick('pen')
            brush.strokeWeight(random(3, 8))
          }
          
          brush.field('seabed')
          brush.line(jarX, reflectionY+random(-jarHeight*.05, jarHeight*.05), jarX+random(jarWidth*.5), reflectionY)
        }
      }

      // right side reflections
      for (let y = 0; y < random(0, 3); y++) {
        let reflectionY = random(jarY, jarY+jarHeight*.8)
        for (let n = 0; n < random(5, 10); n++) {
          if (random() > .5) {
            brush.pick('marker2')
            brush.strokeWeight(random(1, 2))
          } else {
            brush.pick('pen')
            brush.strokeWeight(random(1, 4))
          }
          
          brush.field('seabed')
          brush.line(jarX+jarWidth, reflectionY+random(-jarHeight*.05, jarHeight*.05), jarX+jarWidth-random(jarWidth*.5), reflectionY)
        }
      }


      // Firefirelies inside jar
      for (let i = 0; i < random(6, 30); i++) {
        const x = jarX + random(jarWidth*.2, jarWidth*.8)
        const y = jarY + random(-lidHeight*1.5, jarHeight*.5)
        let size = random() > .75 ? random(minSize*.005, minSize*.025) : random(minSize*.0025, minSize*.015)

        // Paint the spots 
        const col = random(150, 255) 
        for (let j = 0; j < 3; j++) {
          brush.fill(col+j*10, col+j*10, j*90, random(100, 255))
          brush.circle(x, y, size - j*minSize*.0025)
        }

        if (size > minSize*.01) {
          fireflies.push({x, y, size, inJar: true})
        }
      }      

      fireflies.forEach(({x, y, size, inJar = false}) => {
        // Firefly effects
        // Glow with rings
        if (~~random(4) === 1 || inJar) {
          brush.field('curved')
          brush.noFill()
          
          let hasCreatedStars = false
          for (let k = 0; k < ~~random(6, 20); k++) {
            let r = size + random(minSize * 0.01, minSize * 0.05)
            let startAngle = random(PI*2)
            let endAngle = startAngle + random(PI)
    
            brush.pick('pen')
            if (random(8) > 2 && !inJar) {
              const col = random(155, 255)
              brush.stroke(col, col, 0)
              brush.strokeWeight(random(1, 9))
            } else {
              const col = random(100, 200) 
              
              // Add 4 lines in star shape around center
              if (!hasCreatedStars && random() > .5) {
                brush.stroke(col+100, col+100, 255)
                const angle = random(PI*2)
                for (let a = 0; a < 4; a++) {
                  brush.strokeWeight(random(1, 6))
                  const len = random(size*1.5, size*2.5)
                  brush.line(x - cos(angle + a*PI*.25)*len, y - sin(angle + a*PI*.25)*len, x + cos(angle + a*PI*.25)*len, y + sin(angle + a*PI*.25)*len)
                }
                hasCreatedStars = true
              }

              if (inJar) {
                brush.stroke(col+50, col+50, 0)
                brush.strokeWeight(random(1, 6))
                brush.pick('spray')
              } else {
                brush.stroke(col, col, 0)
                brush.strokeWeight(random(1, 6))
                brush.pick('spray')
              }
            }
    
            brush.arc(x, y, r, startAngle, endAngle)
          }
        }
      })


      // Grass
      // - n "layers" of grass
      // - each layer gets shorter but brighter
      // - occasionally a blade will catch the light as yellow
      brush.field('seabed')
      brush.field('curved')
      for (let n = 0; n < 1; n++) {
        let grassCount = 200-n*30
        for (let i = 0; i < grassCount; i++) {
          brush.pick('pen')
          brush.strokeWeight(random(minSize*.0025, minSize*.025))
          
          if (n < 2 && random(25) < 1) {
            const col = random(100, 200)
            brush.stroke(col, col, 0)
          } else {
            brush.stroke(random(10, 40)+n*8, random(30, 60)+n*12, 0)
          }

          const initAngle = PI*.5+random(-PI*.25, PI*.25)
          brush.beginStroke('curve', width/2-i/grassCount*width, height/2)
          brush.segment(initAngle, random(minSize*.01, minSize*.2), 1)
          brush.endStroke(initAngle + random(-PI*.35, PI*.35))
        }
      }


      brush.reDraw()
      brush.reBlend()
    },

    draw () {
    }
  })
})