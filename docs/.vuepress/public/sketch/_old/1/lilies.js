export default function () {
// Devlog: https://midifungi.notion.site/Lily-Pads-6d00ef1fc4484fd08a2a986fde9ba98c
// Number of points per lily pad
Layers.create(() => {
  const lilyDetail = 60

  new Layer({
    id: 'lilies',
    noLoop: true,

    store: {
      pads: []
    },
    
    setup () {
      // Create some lily pads
      const numPads = random(8, 16)
      for (let i = 0; i < numPads; i++) {
        let angle = random(0, TWO_PI)
        let size = (random() > .2 ? random(.05, .08) : random(.05, .15)) * minSize
        let dist = random(.1, .25) * minSize
        let x = width/2 - cos(angle) * dist
        let y = height/2 - sin(angle) * dist
        
        // Create a noisy circle
        angle = 0
        const startAngle = random(0, TWO_PI-TWO_PI/6)
        const endAngle = startAngle + random(PI/16, TWO_PI/6)
        
        const lily = []
        for (let n = 0; n < lilyDetail; n++) {
          let xx
          let yy
          if (angle > startAngle && angle < endAngle) {
            xx = cos(angle) * size * .1
            yy = sin(angle) * size * .1
          } else {
            xx = cos(angle) * size * map(noise(i*1000+n*.25), 0, 1, .9, 1.1)
            yy = sin(angle) * size * map(noise(i*1000+n*.25), 0, 1, .9, 1.1)
          }

          lily.push([xx, yy])
          angle += TWO_PI / lilyDetail
        }

        // Colors
        let col = [...this.colors[3]]
        col[0] += random(-50, 50)

        let stroke = [...col]
        stroke[0] += random(-25, 25)
        stroke[2] -= random(.03, .15)
        
        $pads.push({
          x,
          y,
          points: lily,
          size: size,
          strokeWeight: random(.0025, .015) * minSize,
          stroke,
          color: col,
          rotate: random(0, TWO_PI),
        })
      }

      // Sort by size
      $pads.sort((a, b) => a.size > b.size ? 1 : -1)
    },
    
    draw () {
      // Draw lilies
      $pads.forEach(pad => {
        fill(pad.color)
        stroke(pad.stroke)

        strokeWeight(pad.strokeWeight)
        push()
        translate(pad.x, pad.y)
        rotate(pad.rotate)
        beginShape()
        pad.points.forEach(point => {
          vertex(point[0], point[1])
        })
        endShape(CLOSE)
        pop()
      })
    }
  })
})
}