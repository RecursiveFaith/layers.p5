export default function () {
Layers.create(() => {
  new Layer({
    id: 'bgBasic',
    noLoop: true,

    menu: {
      bg: {
        type: 'slider',
        options: Layers.default.colors
      }
    },
    store: {},

    setup () {},

    draw () {
      background($bg)
    }
  })
})
}