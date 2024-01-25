export default function () {
Layers.create(() => {
  new Layer({
    id: 'shapes',
    renderer: WEBGL,

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
      fill(this.colors[1])
      stroke(255)
      strokeWeight(3)

      push()
      translate(-width/3.5, -height/3.5)
      rotateY(frameCount / this.fps)
      rotateX(frameCount/this.fps)
      box(100)
      pop()
      
      push()
      translate(-width/3.5, -height/3.5)
      translate(0, height/3.5)
      translate(0, height/3.5)
      rotateY(-(frameCount+100)/this.fps)
      rotateX(-(frameCount+100)/this.fps)
      torus(60, 20, 6, 6)
      pop()
    }
  })
})
}