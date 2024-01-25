Layers.ready(() => {
  /**
   * The layer
   */
  new Layer({
    id: 'fighters',
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
      let team, numSprites
      $fighters = []
      
      // Create sprites
      // Team 1
      team = random(Layers.audience.$.sprites.fighters)
      numSprites = random() > .5 ? ~~random(1, 3) : ~~random(1, 10)
      for (let i = 0; i < numSprites; i++) {
        $fighters.push(new Layers.audience.Sprite({
          sprite: team,
          x: random(60, 100),
          y: random(50, 20),
          tint: random() > .5 ? [~~random(-255, 255), ~~random(240, 255), 255] : null,
          flip: false
        }))
      }

      // Team 2
      team = random(Layers.audience.$.sprites.fighters)
      numSprites = random() > .5 ? ~~random(1, 3) : ~~random(1, 10)
      for (let i = 0; i < numSprites; i++) {
        $fighters.push(new Layers.audience.Sprite({
          sprite: team,
          x: random(100, 160),
          y: random(50, 20),
          tint: random() > .5 ? [~~random(-255, 255), ~~random(240, 255), 255] : null,
          flip: true
        }))
      }

      // Sort sprites by y
      $fighters.sort((a, b) => a.y - b.y)
    },

    draw () {
      // Wait until image loaded
      if (!$hasDrawn) {
        let allLoaded = true
        Layers.audience.$.sprites.fighters.forEach((sprite, n) => {
          if (!sprite.img || !sprite.img?.gifProperties?.numFrames) {
            allLoaded = false
          } else {
            $fighters.forEach(fighter => {
              if (fighter.config.sprite.id === n) {
                fighter.img = sprite.img
              }
            })
          }
        })
          
        if (allLoaded) {
          push()
            translate(Layers.audience.$.povX, Layers.audience.$.povY)
            $fighters.forEach(sprite => sprite.draw())
          pop()
          $hasDrawn = true
        }
      }
    }
  }, 'stageBg')
})