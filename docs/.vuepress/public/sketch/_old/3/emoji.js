export default function (config) {
Layers.create(() => {
  const size = minSize * .8
  
  class Tracer {
    constructor (opts) {
      this.size = opts.size
    }
  }
    
  class Emoji {
    constructor (opts) {
      this.opts = opts
      this.emoji = random(Emojis.tag.people)
      this.tracers = []
      this.size = opts.size || size
      this.eyeEyeHeight = random(-.5, .5)
      this.x = opts.x + random(-this.size/16, this.size/16)
      this.y = opts.y + random(-this.size/16, this.size/16)
      this.eyeShape = random(['cyclops', 'normal', 'tri', 'quad'])
    }
  
    draw () {
      // // Create a new tracer
      if (frameCount%10 === 0) {
        this.tracers.unshift(new Tracer({size: this.size}))
      }
  
      // Main emoji
      textSize(this.size)
      text(this.emoji, this.x, this.y)
  
      // Tracers
      this.tracers.forEach((tracer, n) => {
        tracer.size -= this.size * .015
        textSize(tracer.size)
        text(this.emoji, this.x, this.y)
  
        if (tracer.size < minSize * .02) {
          this.tracers.splice(n, 1)
        }
      })
  
      // Eyes
      switch (this.eyeShape) {
        case 'cyclops':
          textSize(this.size * .3)
          text('👁️', this.x, this.y - this.eyeEyeHeight)
        break
        case 'normal':
          textSize(this.size * .2)
          text('👁️👁️', this.x, this.y+this.size*this.eyeEyeHeight/2)
        break
        case 'tri':
          textSize(this.size * .2)
          text('👁️👁️', this.x, this.y+this.size*this.eyeEyeHeight/2)
          textSize(this.size * .3)
          text('👁️', this.x, this.y - this.eyeEyeHeight)
        break
        case 'quad':
          textSize(this.size * .2)
          text('👁️👁️', this.x, this.y+this.size*this.eyeEyeHeight/2)
          text('👁️👁️', this.x, this.y+this.size*this.eyeEyeHeight*2)
        break
      }
    }
  }
      
  new Layer({
    id: 'emojis',

    menu: {
      bg: Layers.default.colors
    },
    
    store: {
      emojis: []
    },
    
    setup () {
      textAlign(CENTER, CENTER)
      drawingContext.shadowBlur = 5
      drawingContext.shadowColor = '#000'

      const count = 4
      let size = ceil(minSize/count)
      
      for (let y = 0; y < max(1, height/size-1)*1.2; y++) {
        for (let x = 0; x < max(1, width/size-1)*1.5; x++) {
          $emojis.push(new Emoji({
            size: size*1.5,
            x: x*size*.7+size/2 + size/6,
            y: y*size*.9+size/3 + size/2
          }))
        }
      }

      // Randomly sort emojis
      $emojis.sort((a, b) => random() > .5 ? 1 : -1)
      // Sort vertically
      $emojis.sort((a, b) => a.y > b.y ? 1 : -1)
    },

    draw () {
      background($bg)
      $emojis.forEach(emoji => {
        emoji.draw()
      })

      if (frameCount >= 60) {
        noLoop()
        Layers.trigger('done', this)
      }
    }
  })
})
}