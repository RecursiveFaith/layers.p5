// @fixme make this generic
Layers.ready(() => {
  new Layer({
    id: 'bg',
    colors: ['#1b54aa'],
    colorMode: RGB,
    
    menu: {},
    $: {},

    setup () {
      background(this.colors[0])

      const col = [...this.colors[0]]
      col[0] += 60
      col[1] += 60
      col[2] += 60

      // Create a grid with lines
      stroke(col)
      for (let x = 0; x < width; x += minSize*.025) {
        strokeWeight(random(0, 2))
        line(x, 0, x, height)
      }
      for (let y = 0; y < height; y += minSize*.025) {
        strokeWeight(random(0, 2))
        line(0, y, width, y)
      }
    },

    draw () {}
  })
})