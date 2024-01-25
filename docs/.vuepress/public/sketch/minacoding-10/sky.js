Layers.create(() => {
  new Layer({
    id: 'sky',
    noLoop: true,
    
    menu: {
      numCircles: {min: 10, max: 60},
      x: {min: 0, max: 1, step: .01},
      y: {min: .30, max: .75},
      gradient: {min: .5, max: 1, step: .01}
    },
    $: {
    },

    setup () {
      // Add a margin and center
      canvas.resizeCanvas(width*.8, height*.8)
      this.x = width*.1
      this.y = height*.1
    },

    draw () {
      clear()
      noStroke()
      background(this.colors[2])

      // Create concentric circles
      for (let i = 0; i < $numCircles*1.1; i+= 1) {
        if (i < $numCircles*$gradient) {
          fill(this.colors[i%2])
        } else {
          fill(this.colors[1+(i-1)%2])
        }
        circle($x*width, $y*height, maxSize*2.5-i*maxSize*2/$numCircles)
      }
    }
  })
})