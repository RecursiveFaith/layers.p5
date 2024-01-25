Layers.create(() => {
  new Layer({
    id: 'window',
    noLoop: true,
    
    menu: {
      width: {min: .01, max: .05}
    },
    $: {
    },

    setup () {
    },

    draw () {
      // Split canvas into 3 rows of 2
      clear()
      noFill()
      strokeWeight(width*$width)
      stroke(this.colors[6])
      line(0, height/3+height*.05, width, height/3+height*.05)
      line(0, height/3*2, width, height/3*2)
      line(width/2, 0, width/2, height-height*.05)
    }
  })
})