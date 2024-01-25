export default function () {
  Layers.create(() => {
    const numWallpapers = ~~random(3, Layers.default.colors.length)
    const wallpaperColors = [...Array(Layers.default.colors.length).keys()]

    /**
    * Create a new layer for each wallpaper
    */
    for (let i = 0; i < numWallpapers; i++) {
      new Layer({
        id: `bg${i}`,
        noLoop: true,
        
        // Create a menu
        menu: {
          // Access/set value with $bg
          bg: {
            options: Layers.default.colors,
            type: 'slider'
          }
        },

        store: {
          size: null,
          scale: null,
          spaceY: null,
          cols: null,
          offset: null,
          holes: []
        },
        
        // Called whenever you press "Regenerate Layer"
        setup () {
          const availableColors = [...wallpaperColors]
          
          // Create wallpapers
          // Extract a color and make it unselectable for the next
          $bg = this.colors[availableColors.splice(~~random(availableColors.length), 1)]
          $size = minSize*.1
          $scale = random(.8, 1.15)
          $spaceY = 3.5
          $cols = width/$size+2
          $offset = {x: random($size*.5), y: random($size*.5)}
          
          // Add holes to the wallpaper
          $holes = []
          for (let j = 0; j < ~~random(1, 6); j++) {
            let hole = {
              x: random(width),
              y: random(height),
              size: random(minSize*.01, minSize*.8),
              depth: ~~random(1, 3),
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
        
        // Eventually each layer will have its own controllable fps
        // `offscreen` is an extra offscreen canvas unique to this layer
        // All draw commands are now mapped to this.canvas so draw like normal
        draw () {
          // First write to offscreen
          // then cut out a chunk of wallpaper
          // then paste to main canvas
          
          // Draw offscreen, set a shadow to the main canvas, then paste the offscreen onto the canvas
          clear()
          offscreen.clear()
          offscreen.strokeWeight(minSize*.003)
          offscreen.fill($bg)
          
          // Circular pattern
          for (let y = -1; y < height/$size*$spaceY + 1; y++) {
            for (let x = -1; x < $cols; x++) {
              let col1 = [...$bg]
              col1[0] += 50 - noise(x*.25, y*.25)*100
              col1[1] += noise(x*.25+10*$offset.x, y*.25+10*$offset.x)*.4
              col1[2] += noise(x*.25+30*$offset.x, y*.25+30*$offset.y)*.4
              offscreen.stroke(col1)
              
              offscreen.push()
              offscreen.translate($offset.x, $offset.y)
              offscreen.translate(x*$size + (floor(y)%2 * $size/2), y*$size/$spaceY)
              offscreen.circle(0, 0, $size*$scale)
              offscreen.circle(0, 0, $size*$scale*.75)
              offscreen.circle(0, 0, $size*$scale*.5)
              offscreen.circle(0, 0, $size*$scale*.25)
              offscreen.circle(0, 0, 0)
              offscreen.pop()
            }
          }
          
          // Cut out a chunk of wallpaper
          if (this.id !== 'bg0') {
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
          }
          
          // Add shadow
          drawingContext.shadowColor = 'black'
          drawingContext.shadowBlur = minSize*.01
          image(offscreen, 0, 0)
          drawingContext.shadowBlur = 0
        }
      })
    }    
  })
}