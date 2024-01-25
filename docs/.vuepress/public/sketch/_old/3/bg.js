export default function () {
Layers.create(() => {
  new Layer({
    id: 'bg',

    colors: [
      // green
      '#10D7AE',

      // @see https://www.colourlovers.com/palette/3636765/seapunk_vaporwave
      // pink
      '#FF6AD5'
    ],
    
    draw () {
      clear()
      background(this.colors[0])
    }
  })
})
}