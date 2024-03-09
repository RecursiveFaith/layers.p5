// Work in progress
// - ⌛ Can take 10+ seconds to load
// - 🐦 Made for #WCchallenge
// - ⚙️ Uses p5.brush: https://github.com/acamposuribe/p5.brush
// - 🖼️ Inspiration: https://www.pinterest.com/pin/596797388140508588/
Layers.ready(() => {
  new Layer({
    id: 'sketch',
    renderer: WEBGL,

    $: {
      painted: {},
      moonSize: 0,
      moonX: 0,
      jarX: 0,
      jarY: 0,
      jarWidth: 0,
      jarHeight: 0,
      jarX: 0,
      jarY: 0,
      jarOpacity: 0,
      lidHeight: 0,
      lidWidth: 0,
      fireflies: []
    },

    stamp: {
      clouds: 0,
      moon: 0,
      jar: 0,
      lid: 0,
      grass: 0,
      moonRings: 0,
      fireflies: 0,
    },
    
    setup () {
			// Let's paint!
			// - In p5.js things are normally "stamped" onto the canvas
			// - But with p5.brush things are "brushed" using flow fields
			// - The methods/shapes are the same but you can control
			//   how the strokes and fills are brushed onto the canvas
      background(0)
      brush.load(this.canvas)
      brush.noStroke()
      brush.noField()

      $fireflies = []
      $moonSize = random(minSize/10, minSize/4)
      $moonX = random(-width/2, width/2)
      $jarWidth = random(minSize*.25, minSize*.45)
      $jarHeight = random(minSize*.45, minSize*.75)
      $jarX = random(-width/2, 0)
      $jarY = random(height/3, height/1.5)-$jarHeight/2
      $jarOpacity = random(60, 150)
      $lidWidth = $jarWidth*random(.6, .9)
      $lidHeight = $jarHeight*random(.15, .3)

      this.stamp.clouds = 0
      this.stamp.moon = 0
      this.stamp.jar = 0
      this.stamp.lid = 0
      this.stamp.grass = 0
      this.stamp.moonRings = 0
      this.stamp.fireflies = 0
    },

    draw () {
			// Blueish-gray clouds
      if(this.maybeStamp('clouds', () => {
        brush.fill(50, 50, random(155, 200), 255)
        brush.rect(-width/1.5, -height/1.5, width*1.5, height*1.5)
        // Ambient color
        brush.fill(random(30), random(30), random(10, 50), 155)
        brush.rect(-width/1.5, -height/1.5, width*1.5, height*1.5)

        brush.reDraw()
        brush.reBlend()

        return ++this.stamp.clouds
      }, () => this.stamp.clouds < 1)) return;

      // Moon
      if (this.maybeStamp('moon', () => {
        brush.fill(255, 255, 255, 255)
        brush.circle($moonX, -height/2, $moonSize)
  
        brush.reDraw()
        brush.reBlend()
        return ++this.stamp.moon
      }, () => this.stamp.moon < 1)) return;

      // Moon rings
      if (this.maybeStamp('moonRings', () => {
        brush.noField()
        brush.noFill()
        let maxRingDist = random()>.8 ? random(minSize*.15, minSize*.35) : random(minSize*.15)
        const ringStyle = random()>.5
        for (let i = 0; i < ~~random(50, 300); i++) {
          let r = $moonSize + random(minSize*0.01, minSize*0.15 + maxRingDist)
          let startAngle = random(-PI*.1, PI+PI*.1)
          let endAngle = startAngle + random(PI*.1, PI*.75)

          if (!ringStyle) {
            const col = random() > .8 ? random(150, 225) : random(80, 120)
            brush.stroke(col, col, col + random(100))
          } else {
            brush.stroke(random() > .8 ? random(150, 225) : random(80, 120), random() > .8 ? random(150, 225) : random(80, 120), random() > .8 ? random(150, 225) : random(80, 120) + random(100))
          }
          brush.strokeWeight(max(1, random(minSize*0.001, minSize*0.025)))

          if (random() > .5) {
            brush.pick('pen')
          } else {
            brush.pick('marker2')
          }

          brush.arc($moonX, -height/2, r, startAngle, endAngle)
        }

        brush.reDraw()
        brush.reBlend()
        return ++this.stamp.moonRings
      }, () => this.stamp.moonRings < 1)) return;



      // Grass
      // - n "layers" of grass
      // - each layer gets shorter but brighter
      // - occasionally a blade will catch the light as yellow
      if (this.maybeStamp('grass', () => {
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

        brush.reDraw()
        brush.reBlend()
        return ++this.stamp.grass
      }, () => this.stamp.grass < 1)) return;



      // Normal $Fireflies
      // - some will glow
      // - illuminates environment dust
      if (this.maybeStamp('fireflies', () => {
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
            $fireflies.push({x, y, size})
          }
        }
        
        brush.reDraw()
        brush.reBlend()
        return ++this.stamp.fireflies
      }, () => this.stamp.fireflies < 1)) return;





      // Glass jar
      if (this.maybeStamp('jar', () => {
        brush.pick('pen')
        brush.fill(155, 155, 255, $jarOpacity)
        
        // body
        brush.noField()
        brush.stroke(50+$jarOpacity, 50+$jarOpacity, 50+$jarOpacity)
        brush.strokeWeight(max(1, random(minSize*.001, minSize*.005)))
        brush.rect($jarX, $jarY, $jarWidth, $jarHeight)
        brush.strokeWeight(max(1, random(minSize*.001, minSize*.005)))
        brush.rect($jarX, $jarY, $jarWidth, $jarHeight)

        // fill
        brush.noStroke()
        brush.rect($jarX, $jarY, $jarWidth, $jarHeight)

        // lid
        brush.stroke(50+$jarOpacity, 50+$jarOpacity, 50+$jarOpacity)
        brush.rect($jarX+($jarWidth-$lidWidth)/2, $jarY-$lidHeight*1.0, $lidWidth, $lidHeight)
        brush.rect($jarX+($jarWidth-$lidWidth)/2, $jarY-$lidHeight*1.0, $lidWidth, $lidHeight)

        // White moon reflection lines inside jar
        brush.stroke(255, 255, 255)

        // left side reflections
        for (let y = 0; y < random(0, 3); y++) {
          let reflectionY = random($jarY, $jarY+$jarHeight*.8)
          for (let n = 0; n < random(5, 10); n++) {
            if (random() > .5) {
              brush.pick('marker2')
              brush.strokeWeight(random(1, 2))
            } else {
              brush.pick('pen')
              brush.strokeWeight(random(3, 8))
            }
            
            brush.field('seabed')
            brush.line($jarX, reflectionY+random(-$jarHeight*.05, $jarHeight*.05), $jarX+random($jarWidth*.5), reflectionY)
          }
        }

        // right side reflections
        for (let y = 0; y < random(0, 3); y++) {
          let reflectionY = random($jarY, $jarY+$jarHeight*.8)
          for (let n = 0; n < random(5, 10); n++) {
            if (random() > .5) {
              brush.pick('marker2')
              brush.strokeWeight(random(1, 2))
            } else {
              brush.pick('pen')
              brush.strokeWeight(random(1, 4))
            }
            
            brush.field('seabed')
            brush.line($jarX+$jarWidth, reflectionY+random(-$jarHeight*.05, $jarHeight*.05), $jarX+$jarWidth-random($jarWidth*.5), reflectionY)
          }
        }

        brush.reDraw()
        brush.reBlend()
        return ++this.stamp.jar
      }, () => this.stamp.jar < 1)) return;


      // Firefirelies inside jar
			// Don't clear...restamp to create "blurred" chroma effect
      if (this.maybeStamp('fireflies', () => {
        for (let i = 0; i < random(12, 40); i++) {
          const x = $jarX + random($jarWidth*.2, $jarWidth*.8)
          const y = $jarY + random(-$lidHeight*1.5, $jarHeight*.5)
          let size = random() > .75 ? random(minSize*.005, minSize*.025) : random(minSize*.0025, minSize*.015)
  
          // Paint the spots 
          const col = random(150, 255) 
          for (let j = 0; j < 3; j++) {
            brush.fill(col+j*10, col+j*10, j*90, random(100, 255))
            brush.circle(x, y, size - j*minSize*.0025)
          }
  
          if (size > minSize*.01) {
            $fireflies.push({x, y, size, inJar: true})
          }
        }      
  
        $fireflies.forEach(({x, y, size, inJar = false}) => {
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

        brush.reDraw()
        brush.reBlend()
        return ++this.stamp.fireflies
      }, () => this.stamp.fireflies === 1)) return;


      // Grass
      // - n "layers" of grass
      // - each layer gets shorter but brighter
      // - occasionally a blade will catch the light as yellow
      if ($painted.grass === 1) {
        $painted.grass = 2
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
        return ++this.stamp.grass
      }      
    }
  })
})