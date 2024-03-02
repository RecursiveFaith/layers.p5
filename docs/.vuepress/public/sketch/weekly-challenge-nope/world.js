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
      noStroke()

      // Draw floor
      push()
        texture(Layers.boardwalk.canvas)
        translate(0, minSize/2, -minSize*2)
        rotateX(PI/2)
        plane(minSize*2.5, height*4)
      pop()

      // Draw wall
      push()
        texture(Layers.boardwalk.canvas)
        translate(0, -minSize, -minSize*2)
        plane(minSize*2.5, height*4)
      pop()

      // Portal: Outer door
      for (let i = 0; i < 4; i++) {
        push()
          translate(0, 0, -minSize*(1.8+i*.01))
          fill(this.colors[wrap(i-floor(frameCount*.1), 0, this.colors.length-1)])
          plane(minSize*2.5/(1.8-i*.15), height*4/(1.8-i*.1))
        pop()
      }

      // Portal: Spacetime
      push()
        texture(Layers.starfield.canvas)
        translate(0, 0, -minSize*1.8)
        plane(minSize*2.5/2, height*4/2)
      pop()
    }
  })
})