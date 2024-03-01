Layers.create(() => {
  /**
  * 3D World layer
  */
  new Layer({
    id: 'world',
    
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
    }
  })
})