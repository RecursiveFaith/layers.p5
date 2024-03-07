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
      brush.noStroke()
      for (let i = 0; i < random(25, 50); i++) {
        brush.fill(random(150, 255), random(150, 255), 0, random(100, 255))
        brush.circle(random(-width/1.75, width/1.75), random(-height/1.75, height/1.75), random(minSize*.005, minSize*.025))
      }

      brush.reDraw()
      brush.reBlend()
    },

    draw () {
    }
  })
})