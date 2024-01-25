space.topLeft = {
  setup: function () {
    this.moar = new Moar({
      id: 'topLeft',
      x: frame.width,
      y: frame.height,
      width: col4,
      height: row4,
      bg: 2,

      /**
       * Create stripes
       */
      onSetup (moar) {
        // Create thing
        let size = min(moar.height, moar.width) * .6
        const thing = moar.addThing(moar.width / 2 - size / 3 - moar.width / 40, moar.height / 2 + moar.height / 40, size / 2, {
          shape: 'circle',
          pupil: {
            size: random(.2, .8)
          },
          iris: {
            color: 0,
          },
          eyelid: {
            top: random(.2, .6),
            bottom: random(.2, .6)
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
      canvas.background(color(moar.bgColors[4]))
  
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

      // Frame
      canvas.push()
      canvas.noFill()
      canvas.stroke(colors[6])
      canvas.strokeWeight(_strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
      
      canvas.translate(_strokeWeight, _strokeWeight)
      canvas.rect(_strokeWeight / 4, _strokeWeight / 4, moar.width - _strokeWeight / 2, moar.height - _strokeWeight / 2)
 
      // White corner frame
      canvas.stroke(colors[6])
      canvas.fill(100, 100, 100)
      canvas.rect(0, moar.height - _strokeWeight - moar.height / 15, moar.width - _strokeWeight, moar.height / 15)
      canvas.rect(moar.width - moar.width / 15 - _strokeWeight, _strokeWeight / 4, moar.width / 15, moar.height - moar.height / 15 - _strokeWeight * 1.5)
  
      canvas.noStroke()
      canvas.rect(moar.width - moar.width / 15 - _strokeWeight / 2, moar.height - _strokeWeight * 2 - moar.height / 15, moar.width / 15 - _strokeWeight, moar.height / 15)
 
      canvas.pop()
    })
  }
}