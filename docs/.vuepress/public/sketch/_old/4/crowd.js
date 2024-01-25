export default function (config) {
/**
 * This uses the "Starfield" technique to place passengers as if they are "zooming" in towards us
 * @see: https://www.youtube.com/watch?v=17WoOqgXsRM
 */
class Emoji {
  constructor () {
    this.emoji = random(config.faces || Emojis.tag.faces)
    this.x = random(-width, width)
    this.y = height/1.5
    this.z = height-random(minSize*.7)
    this.speed = random(2, 10)
    this.hidden = false
  }

  draw () {
    const sx = map(this.x / this.z, 0, 1, 0, width)
    const sy = map(this.y / this.z, 0, 1, 0, height)

    let scale = map(this.z, 0, maxSize, minSize*.4, minSize*.05)
    push()
    translate(sx, sy)
    rotate(random(PI/-16, PI/16))
    textSize(max(0, scale))
    text(this.emoji, 0, 0)
    pop()
  }
}
  
Layers.create(() => {
  new Layer({
    id: 'crowd',
    noLoop: true,

    store: {
      numEmojis: 0,
      emojis: []
    },
    
    setup () {
      $numEmojis = minSize*1.5
      $emojis = []
      for (let i = 0; i < $numEmojis; i++) {
        $emojis.push(new Emoji())
      }
      drawingContext.shadowBlur = 5
      drawingContext.shadowColor = '#000'
    },

    draw () {
      clear()
      $emojis.sort((a, b) => b.z - a.z)

      push()
      translate(width/2, 0)
      fill(Layers.default.colors[6])
      rect(-width/2, height/1.35, width, height)
      $emojis.forEach(thing => {
        thing.draw()
      })
      pop()
    }
  })
})
}