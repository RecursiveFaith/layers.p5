export default function () {

Layers.create(() => {
  new Layer({
    id: 'bg',
    noLoop: true,

    colors: [
      // Limestone base
      '#eee2c7',
      // Dark Green
      '#003333'
    ],

    menu: {},
    store: {},

    draw () {
      background(this.colors[0])

      noStroke()
      fill(this.colors[1])
      
      // @todo Noisy line
      rect(0, minSize*.05, width, minSize*.01)
      rect(0, minSize*.05*2, width, minSize*.01)

      rect(0, height-minSize*.05, width, minSize*.01)
      rect(0, height-minSize*.05*2, width, minSize*.01)
    }
  })
})
}