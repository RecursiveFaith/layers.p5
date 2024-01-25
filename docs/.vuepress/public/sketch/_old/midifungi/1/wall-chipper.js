export default function () {
  Layers.create(() => {
    new Layer({
      id: 'wallChipper',
      noLoop: true,
      colors: ['#fff'],
      type: 'filter',
      menuDisabled: true,
      
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
            size: random(minSize*.01, minSize*.4),//random(minSize*.01, minSize*.8),
            points: []
          }
          $holes.push(hole)
          
          for (let k = 0; k < TWO_PI; k += TWO_PI/32) {
            let x = cos(k) * random(minSize*.01, minSize*.8)
            let y = sin(k) * random(minSize*.01, minSize*.8)
            hole.points.push([x, y])
          }
        }

        // Pattern
        let col = 0
        let size = minSize*.1
        this.store = {
          bg: col,
          size: size,
          scale: random(.8, 1.15),
          spaceY: 3.5,
          cols: width/size+2,
          offset: {x: random(size*.5), y: random(size*.5)},
        }
      },
      
      draw () {
        drawingContext.shadowBlur = 0
        let size = $size
        let cols = $cols
        let spaceY = $spaceY

        offscreen.image(Layers.bg.canvas, 0, 0)
        offscreen.image(Layers.main.canvas, 0, 0)
        offscreen.noStroke()
        offscreen.erase()
        
        for (let i = 0; i < $holes.length; i++) {
          let hole = $holes[i]
          offscreen.push()
          offscreen.translate(hole.x, hole.y)
          offscreen.beginShape()
          hole.points.forEach(point => {
            offscreen.vertex(point[0], point[1])
          })
          offscreen.endShape(CLOSE)
          offscreen.pop()
        }
        
        offscreen.noErase()

        // Circular pattern
        for (let y = -1; y < height/size*spaceY + 1; y++) {
          for (let x = -1; x < cols; x++) {
            let col1 = [...this.colors[this.store.bg]]
            // col1[0] += 50 - noise(x*.25, y*.25)*100
            // col1[1] += noise(x*.25+10*this.store.offset.x, y*.25+10*this.store.offset.x)*.4
            // col1[2] += noise(x*.25+30*this.store.offset.x, y*.25+30*this.store.offset.y)*.4
            stroke('#ddd')
            strokeWeight(minSize*.005)
            
            push()
            translate(this.store.offset.x, this.store.offset.y)
            translate(x*size + (floor(y)%2 * size/2), y*size/spaceY)
            circle(0, 0, this.store.size*this.store.scale)
            circle(0, 0, this.store.size*this.store.scale*.75)
            circle(0, 0, this.store.size*this.store.scale*.5)
            circle(0, 0, this.store.size*this.store.scale*.25)
            circle(0, 0, 0)
            pop()
          }
        }

        drawingContext.shadowBlur = 10
        drawingContext.shadowColor = '#000'
        image(offscreen, 0, 0)
      }
    })
  })
}