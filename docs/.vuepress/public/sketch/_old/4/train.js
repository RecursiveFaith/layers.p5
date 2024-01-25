export default function (config) {
/**
 * CHOO CHOO new trains on arrival
 *----------
 * 3 States:
 * -1:  Depart to the left
 * 1: Arrive from the right
 * 0: Unload passengers
 */
Layers.create(() => {
  new Layer({
    id: 'train',
    
		// If you're quick enough you can right click on the train to edit it
		menu: {
      emoji: config.train || ['🚄','🚅','🚈','🚝','🚂'],
      cab: config.cab || ['🚃', '🚋', '🚟', '🚠']
    },
    
		store: {
      x: 0,
      speed: 0,
      acc: .5,
      cabs: ~~random(10, 60),

      // -1 = departing, 0 = idle, 1 = arriving
      state: 0,
      isWaiting: 0
    },
		
    setup () {
      textAlign(CENTER, CENTER)
      drawingContext.shadowBlur = 5
      drawingContext.shadowColor = '#000'
      $isWaiting = ~~random(this.fps*3)
    },
    
		draw () {
      clear()
      const size = minSize * .8
      
      switch ($state) {
        // Depart to the left
        case -1:
          $speed += $acc
          $x -= $speed

          // Wrap around on right side
          if ($x < -size*$cabs) {
            $x = $x*-1 - $speed
            $state = 1
            $emoji = config.train || random(['🚄','🚅','🚈','🚝','🚂'])
            $cab = config.cab || random(['🚃', '🚋', '🚟', '🚠'])
          }
        break

        // Idling
        case 0:
          $isWaiting += 1
          if ($isWaiting > this.fps*3) {
            $isWaiting = 0
            $state = -1
          }
        break

        // Arraive from the right
        case 1:
          $speed -= $acc
          $x -= $speed

          if ($speed > -$acc && $speed < $acc) {
            $speed = 0
            $x = 0
            $state = 0
            $cabs = ~~random(10, 60)
            Layers.traffic.resetCrowd()
          }
        break
      }
      
      textSize(size)
      text($emoji, width/2 + $x, height/2 + size*.1)
      for (let i = 1; i < $cabs; i++) {
        text($cab, width/2 + $x + i*size, height/2 + size*.1)
      }
    }
  })
})
}