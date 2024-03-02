Layers.create(() => {
  /**
  * 3D World layer
  */
  new Layer({
    id: 'world',
    renderer: WEBGL,
    
    // These automatically convert into sliders
    // You can also bind with MIDI through right click!
    menu: {
    },
    
    // Non menu variables
    // Access with $stars within draw(), setup()
    // or with this.store.stars everywhere else
    $: {
    },
    
    setup () {
    },
    
    // Each layer has own canvas
    // but p5 methods magically point to correct canvas so no need for canvas.background()
    draw () {
      clear()

      // Draw wall
      push()
        texture(Layers.boardwalk.canvas)
        translate(0, -minSize, -minSize*2)
        noStroke()
        plane(minSize*2.5, height*4)
      pop()

      // Draw floor
      push()
        texture(Layers.boardwalk.canvas)
        translate(0, minSize/2, -minSize*2)
        noStroke()
        rotateX(PI/2)
        plane(minSize*2.5, height*4)
      pop()
    }
  })
})