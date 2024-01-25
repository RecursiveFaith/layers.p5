Layers.ready(() => {
  /**
   * The layer
   */
  new Layer({
    id: 'stageBg',
    width: 256,
    height: 200,
    
    $: {
      hasDrawn: false,
      ratio: 0,
      fighters: [],
      bgImg: null,
      bgFence: null,
    },
    colors: ['#bcbcbc'],

    setup () {
      // Due to bug we gotta wait a bit
      setTimeout(() => {
        this.$bgImg = loadImage('/sketch/minacoding-14/pro-wrestling-stage.png')
        this.$bgFence = loadImage('/sketch/minacoding-14/pro-wrestling-fence.png')
      }, 0)
    },

    draw () {
      if (!$hasDrawn) {
        if (this.$bgImg?.width > 1 && this.$bgFence?.width > 1) {
          // Mat
          translate(0, Layers.audience.$.povY)
          fill(this.colors[0])
          rect(-20, 0, width+20, height*2+20)
          $hasDrawn = true

          push()
            // Repeat fence across the top
            const ratio = minSize / this.$bgFence.height
            const fenceWidth = this.$bgFence.width * ratio * .16
            const fenceHeight = this.$bgFence.height * ratio * .16

            const fenceCount = Math.ceil(width / fenceWidth)
            for (let i = 0; i < fenceCount; i++) {
              image(this.$bgFence, i * fenceWidth, 0, fenceWidth, fenceHeight)
            }
            
            translate(Layers.audience.$.povX, 0)
            image(this.$bgImg, 0, 0)
          pop()        
        }
      }
    }
  }, 'audience')
})