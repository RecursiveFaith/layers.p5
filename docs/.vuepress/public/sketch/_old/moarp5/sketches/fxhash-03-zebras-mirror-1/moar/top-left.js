space.topLeft = {
  setup: function () {
    this.moar = new Moar({
      id: 'topLeft',
      x: cornerRules[0].x,
      y: cornerRules[0].y,
      width: col4,
      height: row4,
      bg: $fxhashFeatures.isMonochrome ? monochromeColor : floor(random(6)),
      disableMenu: +params.disableMenu,

      /**
       * Create stripes
       */
      onSetup (moar) {
        // Shuffled corner alignment
        let offset = {
          x: ['topRight', 'bottomRight'].includes(cornerRules[0].corner) ? -1 : 1
        }

        // Shuffled coner look direction
        switch (cornerRules[0].corner) {
          case 'topLeft':
            offset.angle = 0
          break
          case 'topRight':
            offset.angle = HALF_PI
          break
          case 'bottomRight':
            offset.angle = PI
          break
          case 'bottomLeft':
            offset.angle = -HALF_PI
          break
        }
        
        // Create thing
        let size = min(moar.height, moar.width) * .6
        const thing = moar.addThing(moar.width / 2 - size / 3 - moar.width / 40*offset.x, moar.height / 2 + moar.height / 40, size / 2, {
          shape: 'circle',
          pupil: {
            size: random(.2, .8)
          },
          eyelid: {
            top: random(.2, .6),
            bottom: random(.2, .6)
          },
          look: {
            mode: 'restricted',
            timer: 0,
            r: () => random(.25, 2),
            angle: () => (+params.forceLook || random() > .05) ? offset.angle + HALF_PI/2 + random(-HALF_PI/2.25, HALF_PI/4) : random(TWO_PI),
          }
        })

        moar.cloneThing(moar.width / 2 + size / 3 - moar.width / 40, moar.height / 2 + moar.height / 40, thing, size / 2)
      }
    })
  },





  /**
   * Expanding rings
   */
  draw: function () {
    this.moar.draw((moar, canvas) => {
      canvas.background(color(moar.bgColors[moar.bg]))
  
      // Clouds
      let noiseStep = frameCount * .01
      let cloudSize = moar.width / 3
      canvas.fill(255)
      canvas.stroke(0)
      canvas.strokeWeight(2)

      // nw
      let shift = {x: noise(noiseStep), y: noise(noiseStep + 1000)}
      let shiftRange = cloudSize / 1.75
      
      canvas.push()
      canvas.translate(cloudSize/6, cloudSize/6)
      canvas.circle(cloudSize/2 + shift.x*shiftRange, -cloudSize/6 + shift.y*shiftRange, cloudSize/1.1)
      shift = {x: noise(noiseStep + 100), y: noise(noiseStep + 1000 + 100)}
      canvas.circle(-cloudSize/6 + shift.x*shiftRange, cloudSize/2 + shift.y*shiftRange, cloudSize/1.1)
      shift = {x: noise(noiseStep + 200), y: noise(noiseStep + 1000 + 200)}
      canvas.circle(shift.x*shiftRange, shift.y*shiftRange, cloudSize)
      canvas.pop()

      // ne
      canvas.push()
      canvas.translate(moar.width - cloudSize/6, cloudSize/6)
      shift = {x: noise(noiseStep + 300), y: noise(noiseStep + 1000 + 300)}
      canvas.circle(-cloudSize/2 - shift.x*shiftRange, -cloudSize/6 + shift.y*shiftRange, cloudSize/1.1)
      shift = {x: noise(noiseStep + 400), y: noise(noiseStep + 1000 + 400)}
      canvas.circle(cloudSize/6 - shift.x*shiftRange, cloudSize/2 + shift.y*shiftRange, cloudSize/1.1)
      shift = {x: noise(noiseStep + 500), y: noise(noiseStep + 1000 + 500)}
      canvas.circle(-shift.x*shiftRange, shift.y*shiftRange, cloudSize)
      canvas.pop()
      
      // se
      canvas.push()
      canvas.translate(moar.width - cloudSize/6, moar.height - cloudSize/6)
      shift = {x: noise(noiseStep + 600), y: noise(noiseStep + 1000 + 600)}
      canvas.circle(-cloudSize/2 - shift.x*shiftRange, cloudSize/6 - shift.y*shiftRange, cloudSize/1.1)
      shift = {x: noise(noiseStep + 700), y: noise(noiseStep + 1000 + 700)}
      canvas.circle(cloudSize/6 - shift.x*shiftRange, -cloudSize/2 - shift.y*shiftRange, cloudSize/1.1)
      shift = {x: noise(noiseStep + 800), y: noise(noiseStep + 1000 + 800)}
      canvas.circle(-shift.x*shiftRange, -shift.y*shiftRange, cloudSize)
      canvas.pop()

      // sw
      canvas.push()
      canvas.translate(cloudSize/6, moar.height - cloudSize/6)
      shift = {x: noise(noiseStep + 900), y: noise(noiseStep + 1000 + 900)}
      canvas.circle(cloudSize/2 + shift.x*shiftRange, cloudSize/6 - shift.y*shiftRange, cloudSize/1.1)
      shift = {x: noise(noiseStep + 1000), y: noise(noiseStep + 1000 + 1000)}
      canvas.circle(-cloudSize/6 + shift.x*shiftRange, -cloudSize/2 - shift.y*shiftRange, cloudSize/1.1)
      shift = {x: noise(noiseStep + 1100), y: noise(noiseStep + 1000 + 1100)}
      canvas.circle(shift.x*shiftRange, -shift.y*shiftRange, cloudSize)
      canvas.pop()

      // Draw corner
      if ($fxhashFeatures.sameCorners) {
        drawCornerFrame(moar.id, canvas)
      } else {
        drawCornerFrame(cornerRules[0].corner, canvas)
      }
    })
  }
}