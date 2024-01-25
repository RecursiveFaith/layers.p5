export default function () {
Layers.create(() => {
  new Layer({
    id: 'ripples',
    noLoop: true,

    // We create the lilies before the ripples so we shift this layer below them
    setup () {
      // Find this layer within Layers and moveDown if this layer is above Layers.lilies
      // @todo Add an .insetBefore()
      const curIdx = Layers.all.findIndex(layer => layer.id === 'ripples')
      const liliesIdx = Layers.all.findIndex(layer => layer.id === 'lilies')
      if (curIdx > liliesIdx) {
        this.moveDown()
      }
    },

    draw () {
      background(this.colors[4])
      noFill()

      Layers.lilies.store.pads.forEach(pad => {
        for (let i = 1; i < 5; i++) {
          stroke(255, 1 - i/5)
          circle(pad.x, pad.y, pad.size * 1.5*i)
        }
      })
    }
  })
})
}