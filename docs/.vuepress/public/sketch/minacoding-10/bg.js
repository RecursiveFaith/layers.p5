Layers.create(() => {
  new Layer({
    id: 'sky',
    noLoop: true,
    
    menu: {
    },
    $: {
    },

    setup () {
      clear()
      background(this.colors[6])
    },

    draw () {}
  })
})