Layers.create(() => {
  /**
  * Boardwalk
  */
  new Layer({
    id: 'boardwalk',
    
    // These automatically convert into sliders
    // You can also bind with MIDI through right click!
    menu: {
      spotSize: {min: () => minSize*.1, max: ()=> minSize*.2, onChange () {this.setup()}},
    },
    
    // Non menu variables
    // Access with $stars within draw(), setup()
    // or with this.store.stars everywhere else
    $: {
      width: 2.5,
      height: 4
    },
    
    setup () {
      this.resize(width*$width, height*$height, false)
    },
    
    // Each layer has own canvas
    // but p5 methods magically point to correct canvas so no need for canvas.background()
    draw () {
      background(255)

      // Create black circles based on number of columns
      // extending the full height of the cnavas
      const cols = ~~(width/$spotSize)
      const rows = ~~(height/$spotSize)
      
      for (let x = -1; x < cols+2; x+=1) {
        for (let y = -1; y < rows+2; y+=1) {
          if (x%2) {
            fill(0)

            if (y%2) {
              circle(x*$spotSize + (y%2) * $spotSize, y*$spotSize, $spotSize * sin(frameCount * 0.05))
            } else {
              circle(x*$spotSize + (y%2) * $spotSize, y*$spotSize, $spotSize * cos(frameCount * 0.05))
            }
          }
        }
      }
    }
  })
})