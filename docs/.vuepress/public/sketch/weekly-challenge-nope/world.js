/**
 * Don't forget to right click, toggle Layers, and visualize in 3D
 */
Layers.create(() => {
  new Layer({
    id: 'world',
    renderer: WEBGL,

    draw () {
      clear()
      noStroke()

      // Draw floor
      // plane(minSize*2.5, height*4)
      textureMode(NORMAL)
      push()
        texture(Layers.boardwalk.canvas)
        translate(0, minSize/2, -minSize*2)
        rotateX(PI/2)
        beginShape()
          vertex(-minSize * 1.25, -height * 2, 0, 0)
          vertex(minSize * 1.25, -height * 2, .5, 0)
          vertex(minSize * 1.25, height * 2, .5, 1)
          vertex(-minSize * 1.25, height * 2, 0, 1)
        endShape(CLOSE)
      pop()

      // Draw wall
      push()
        texture(Layers.boardwalk.canvas)
        translate(0, -minSize, -minSize*2)
        beginShape()
          vertex(-minSize * 1.25, -height * 2, 0, 0)
          vertex(minSize * 1.25, -height * 2, .5, 0)
          vertex(minSize * 1.25, height * 2, .5, 1)
          vertex(-minSize * 1.25, height * 2, 0, 1)
        endShape(CLOSE)
      pop()

      // Portal: Outer door
      for (let i = 0; i < 4; i++) {
        push()
          translate(0, 0, -minSize*(1.8+i*.01))
          fill(this.colors[wrap(i-floor(frameCount*.1), 0, this.colors.length-1)])
          plane(minSize*2.5/(1.8-i*.15), height*4/(1.8-i*.1))
        pop()
      }

      // Portal: Spacetime
      push()
        texture(Layers.starfield.canvas)
        translate(0, 0, -minSize*1.8)
        // plane(minSize*2.5/2, height*4/2)
        beginShape()
          vertex(-minSize * 2.5 / 2/2, -height * 4 / 2/2, 0.25, 0)
          vertex(minSize * 2.5 / 2/2, -height * 4 / 2/2, 0.75, 0)
          vertex(minSize * 2.5 / 2/2, height * 4 / 2/2, 0.75, 1)
          vertex(-minSize * 2.5 / 2/2, height * 4 / 2/2, 0.25, 1)
        endShape(CLOSE)
      pop()
    }
  })
})