export default function (config) {
/**
 * This will trigger Layers.crowd to regenerate
 */
 Layers.create(() => {
  new Layer({
    id: 'traffic',
    menu: {
      emoji: Emojis.tag.cars
    },
    store: {
      x: 0,
      y: 0,
      size: 0,
      shouldClear: false,
    },
    methods: {
      /**
       * Drive by and clear reset the audience
       */
      resetCrowd () {
        this.store.y = height-this.store.size/6
        this.store.x = this.store.size
        this.store.shouldClear = true
      }
    },
    setup () {
      // Drive from left to right, so flip the emojis
      scale(-1, 1)
      textAlign(CENTER, CENTER)
      drawingContext.shadowBlur = 5
      drawingContext.shadowColor = '#000'
      $size = minSize * 3
      this.resetCrowd()
    },
    draw () {
      clear()
      const speed = $size*.05

      $x -= speed
      textSize($size)
      text($emoji, $x-$size*.35, $y)

      if ($shouldClear && $x < 0 && $x > -speed*2) {
        $shouldClear = false
        Layers.crowd.generate(true)
        Layers.crowd.draw()
      }
    }
  })
})
}