Layers.ready(() => {
  /**
   * The layer
   */
  new Layer({
    id: 'stageFg',
    width: 256,
    height: 200,
    
    $: {
      hasDrawn: false,
      fgRing: null,
    },
    colors: ['#bcbcbc'],

    setup () {
      // Due to bug we gotta wait a bit
      setTimeout(() => {
        this.$fgRing = loadImage('/sketch/minacoding-14/pro-wrestling-stage-foreground-rings.png')
      }, 0)
    },
    draw () {
      if (!$hasDrawn) {
        if (this.$fgRing?.width > 1) {
          push()
            $hasDrawn = true
            translate(Layers.audience.$.povX, Layers.audience.$.povY)
            image(this.$fgRing, 0, 0)
          pop()
        }
      }
    }
  }, 'fighters')
})