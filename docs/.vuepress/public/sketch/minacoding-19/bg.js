Layers.ready(() => {
  new Layer({
    id: 'walkers',
    
    menu: {
      blur: {min: 25, max: 100}
    },
    $: {
      walkers: []
    },

    setup () {
      background('#fff')
    },

    draw () {
    },
  })
}, 'bmwalker')