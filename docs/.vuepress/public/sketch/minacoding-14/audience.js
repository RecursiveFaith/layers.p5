Layers.ready(() => {
  const width = 256
  const height = 200
  
  /**
   * The layer
   */
  new Layer({
    id: 'audience',
    width: width,
    height: height,

    menu: {
      // povX: {min: -256/2.5, max: 256/2.5},
      // povY: {min: -50, max: 150},
      povX: {min: -100, max: 100},
      povY: {min: -25, max: 150},
    },

    $: {
      audience: [],
      hasDrawn: false,
      sprites: {
        fighters: [
          {
            id: 0,
            src: '/sketch/minacoding-14/tmnt.gif',
            scale: 1.5
          },
          {
            id: 1,
            src: '/sketch/minacoding-14/tmnt-2.gif',
            scale: 1.5
          },
          {
            id: 2,
            src: '/sketch/minacoding-14/doubledragon.gif',
            scale: 1.5,
            xOff: -10
          },
        ],
        audience: [
          {
            src: '/sketch/minacoding-14/audience.gif',
            scale: .7,
          }
        ]
      },
    },
    colors: ['#bcbcbc'],

    setup () {
      // Pixelated responsive
      const $parent = this.canvas.canvas.parentElement
      const outerRatio = $parent.offsetHeight/200
      const w = this.width = 256
      const h = this.height = map($parent.offsetHeight, 0, $parent.offsetHeight, 0, 200*outerRatio)
      
      this.canvas.resizeCanvas(w, h)
      this.canvas.canvas.style.imageRendering = 'pixelated'
      this.canvas.canvas.style.width = '100%'
      this.canvas.canvas.style.height = 'auto'
      // Due to bug we gotta wait a bit
      setTimeout(() => {
        this.$.sprites.fighters[0].img = loadImage('/sketch/minacoding-14/tmnt.gif')
        this.$.sprites.fighters[1].img = loadImage('/sketch/minacoding-14/tmnt-2.gif')
        this.$.sprites.fighters[2].img = loadImage('/sketch/minacoding-14/doubledragon.gif')
        this.$.sprites.audience[0].img = loadImage('/sketch/minacoding-14/audience.gif')

        this.canvas.canvas.parentElement.style.background = '#bcbcbc'
      }, 0)

      let team, numSprites
      $audience = []
      
      // Create audience
      team = random($sprites.audience)
      numSprites = random() > .5 ? random(1000) : random(200)
      for (let i = 0; i < numSprites; i++) {
        $audience.push(new this.Sprite({
          sprite: team,
          x: random(-20, 300),
          y: random(-20, $povY+60),
          tint: random() > .5 ? [~~random(-255, 255), ~~random(240, 255), 255] : null,
          flip: random([true, false])
        }))
      }

      // Sort audience by y
      background(0)
      $audience.sort((a, b) => a.y - b.y)
    },

    draw () {
      // Wait until image loaded
      if (!$hasDrawn) {
        let allLoaded = $sprites.audience[0].img && $sprites.audience[0].img?.gifProperties?.numFrames
        if (allLoaded) {
          $audience.forEach(audience => {
            audience.img = $sprites.audience[0].img
            audience.draw()
          })
          $hasDrawn = true
        }
      }
    },

    methods: {
      /**
       * Sprite constructor
       */
      Sprite: class {
        constructor (config) {
          this.config = config
          this.hasPickedFrame = false
          this.x = config.x
          this.y = config.y
          this.scale = config.sprite.scale || 1
          this.isFlipped = config.flip || false
          this.tint = config.tint
    
          this.x += this.config.sprite.xOff || 0
        }
    
        draw () {
          if (this.img && this.img?.gifProperties?.numFrames) {
            if (!this.hasPickedFrame) {
              this.hasPickedFrame = true
              this.frame = ~~random(this.img.gifProperties.numFrames)
              this.img.pause()
              this.img.setFrame(this.frame)
              this.x -= this.img.width/2
              this.y -= this.img.height/2
            }
            
            if (this.isFlipped) {
              push()
                translate(width/2+this.x-this.img.width/2, this.y)
                scale(-1, 1)
                image(this.img, 0, 0, this.img.width * this.scale, this.img.height * this.scale)
              pop()
            } else {
              image(this.img, this.x-this.img.width/2, this.y, this.img.width * this.scale, this.img.height * this.scale)
            }
          }
        }
      }
    },    
  })
})