export default function () {
  Layers.create(() => {
  
    // Size of emoji
    const size = minSize * .65
  
    // Represents the tracer
    const Tracer = class {
      constructor () {
        this.size = size
      }
    }
  
    new Layer({
      id: 'self',
  
      menu: {
        emoji: ['🧘', '🧘‍♂️', '🧘‍♀️', '🧘🏻', '🧘🏻‍♂️', '🧘🏻‍♀️', '🧘🏼', '🧘🏼‍♂️', '🧘🏼‍♀️', '🧘🏽', '🧘🏽‍♂️', '🧘🏽‍♀️', '🧘🏾', '🧘🏾‍♂️', '🧘🏾‍♀️', '🧘🏿', '🧘🏿‍♂️', '🧘🏿‍♀️'],
        eyeHeight: {max: 1},
        mouthHeight: {max: 1},
      },
  
      store: {
        tracers: []
      },
  
      setup () {
        textAlign(CENTER, CENTER)
        drawingContext.shadowBlur = 5
        drawingContext.shadowColor = '#000'
      },
      
      draw () {
        clear()
        
        // Create a new tracer
        if (frameCount%10 === 0) {
          $tracers.unshift(new Tracer())
        }
  
        // Main emoji
        fill(255, 1)
        textSize(size)
        text($emoji, width/2, height/1.9)
  
        // Tracers
        $tracers.forEach((tracer, n) => {
          tracer.size -= size * .01
          textSize(tracer.size)
          text($emoji, width/2, height/1.9)
  
          if (tracer.size < minSize * .001) {
            $tracers.splice(n, 1)
          }
        })
  
        fill(255, min(frameCount - 45, 100)/100)
        textSize(size * .2)// + size * sin(frameCount/this.fps) * .1)
        text('👁️👁️', width/2, height/1.9 - $eyeHeight*size*.4)
        text('👄', width/2, height/1.9 - $eyeHeight*size*.4 + $mouthHeight*size*.4)
      }
    })
  })
  }
  
  