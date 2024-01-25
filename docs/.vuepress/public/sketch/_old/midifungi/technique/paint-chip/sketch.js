export default function () {
Layers.create(() => {
  for (let id = 0; id < ~~random(2, 5); id++) {
    new Layer({
      noLoop: true,
      menu: {bg: Layers.default.colors},
  
      store: {
        holes: []
      },
      
      setup () {
        // Add holes and paint chips
        $holes = []
        for (let j = 0; j < ~~random(1, 2); j++) {
          let hole = {
            x: random(width/2, width),
            y: random(height/2, height),
            size: random(minSize*.01, minSize*.4),
            points: []
          }
          $holes.push(hole)
          
          for (let k = 0; k < TWO_PI; k += TWO_PI/32) {
            let x = cos(k) * random(minSize*.01, minSize*.8)
            let y = sin(k) * random(minSize*.01, minSize*.8)
            hole.points.push([x, y])
          }
        }
      },
  
      draw () {
        const size = minSize*.1
        const offset = {x: random(size*.5), y: random(size*.5)}
        const spaceY = 3.5
        const scale = random(.8, 1.15)
        const cols = width/size+2
        
        background($bg)
        noStroke()
        noErase()

        // Simple pattern
        for (let y = -1; y < height/size*spaceY + 1; y++) {
          for (let x = -1; x < cols; x++) {
            let col1 = [...$bg]
            col1[2] += noise(x*.25+30*offset.x, y*.25+30*offset.y)*.4
            fill($bg)
            stroke(col1)
            strokeWeight(minSize*.005)
            
            push()
            translate(offset.x, offset.y)
            translate(x*size + (floor(y)%2 * size/2), y*size/spaceY)
            circle(0, 0, size*scale)
            circle(0, 0, size*scale*.75)
            circle(0, 0, size*scale*.5)
            circle(0, 0, size*scale*.25)
            circle(0, 0, 0)
            pop()
          }
        }
        
        // Remove paint chips
        if (id > 0) {
          erase()
          for (let i = 0; i < $holes.length; i++) {
            let hole = $holes[i]
            push()
            translate(hole.x, hole.y)
            beginShape()
            hole.points.forEach(point => {
              vertex(point[0], point[1])
            })
            endShape(CLOSE)
            pop()
          }

          // Create border
          noErase()
          noFill()
          strokeWeight(minSize*.005)
          stroke('#000')
          for (let i = 0; i < $holes.length; i++) {
            let hole = $holes[i]
            push()
            translate(hole.x, hole.y)
            beginShape()
            hole.points.forEach(point => {
              vertex(point[0], point[1])
            })
            endShape(CLOSE)
            pop()
          }
        }
      }
    })
  }
})
}