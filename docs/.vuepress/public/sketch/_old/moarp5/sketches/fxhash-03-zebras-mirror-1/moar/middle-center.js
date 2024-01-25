space.middleCenter = {
  setup: function () {
    this.moar = new Moar({
      id: 'middleCenter',
      x: frame.width + col4,
      y: frame.height + row4,
      width: col4 * 2,
      height: row4 * 3,
      bg: $fxhashFeatures.isMonochrome ? monochromeColor : floor(random(6)),
      disableMenu: +params.disableMenu,
      customBg: {
        type: random(['triangles', 'circles', 'burst']),
        orig: {
          y: row4
        }
      },
      
      store: {
        trees: [],
        things: [],
        topThings: [],
        hasEyes: random() > .5,
        layout: $fxhashFeatures.centerLayout,
      },

      /**
       * Create stripes
       */
      onSetup (space) {
        let size = min(space.height, space.width) * .8

        // Create center square things
        space.store.topThings = []
        switch (space.store.layout) {
          // Big Eye
          case 0:
            space.store.topThings.push(space.addThing(space.width / 2, space.height / 3, size, {
              pupil: {
                size: random(.2, .8),
              },
              eyelid: {
                top: random(.6, .95),
                bottom: random(.6, .95)
              }
            }))
          break

          // Chameleon Eye
          case 1:
            space.store.topThings.push(space.addThing(space.width / 2, space.height / 2.5, size, {
              eyelashes: 'chief',
              pupil: {
                size: random(.2, .8),
              },
              eyelid: {
                top: random(.6, .95),
                bottom: random(.6, .95)
              }
            }))
          break

          // Grid of eyes
          case 2:
            let grid = floor(random(2, 8))
            size = space.width * .8 / grid
            for (let x = 0; x < grid; x++) {
              for (let y = 0; y < grid; y++) {
                space.store.topThings.push(space.addThing(space.width/grid/2 + x * space.width/grid, space.width/grid/2 + y * space.height/grid/1.5, size, {
                  eyelashes: $fxhashFeatures.hasLashes ? 'chief' : null,
                  pupil: {
                    size: random(.2, .8),
                  },
                  eyelid: {
                    top: random(.6, .95),
                    bottom: random(.6, .95)
                  }
                }))
              }
            }
          break
        }

        // Create jellyfish
        let things = []
        if ($fxhashFeatures.hasJelly) {
          for (let i = 0; i < random(20, 40); i++) {
            let col = [...space.bgColors[random([4])]]
            col.push(random(1, 10) * .01)
            col[0] += random(-20, 20)
  
            things.push(space.addThing({
              x: random(space.width),
              y: random(space.height * 1.75/3, space.height * 2.5/3),
              size: space.width / random(12, 24), //random(space.width / 36, space.width / 24),
              store: {
                color: col,
                strokeWeight: random(3),
                framecountShift: random(),
                speed: random([2, 4, 8]),
                aggressiveness: random(0.25, 1),
              },
              shape: 'circle',
              hidden: !this.store.hasEyes,
              autodraw: false,
              eyelid: {
                color: col,
                top: random(0.25, .8)
              }
            }))
          }
        }

        // Bottom trees
        // Create a tree (eyes will be created in the last 2 branches)
        let bg = random([0, 1, 4, 5])
        let bg2 = random([0, 1, 4, 5])
        
        for (let i = 0; i < random(30, 60); i++) {
          space.store.trees.push(new Moar.FractalTree({
            bg: random() > .1 ? bg : bg2,
            x: random(space.width * -.1, space.width * 1.1),
            y: space.height,
            len: () => random(space.height/12, space.height/6),
            sizeMod: random(.4, 1),
            moar: space,
            shouldGrow: !+params.skipGrow,
            maxDepth: floor(random(2, 5)),
            growStep: 0,
            leafChance: random(0, .1),
            things: {
              // hidden: true,
              // scale: {size: 0},
              angle: () => random(-PI / 8, PI / 8),
              pupil: {
                shape: 'random',
                possibleShapes: ['circle', 'vert']
              },
              look: {
                mode: 'restricted',
                timer: 0,
                r: () => random(.25, 1),
                angle: () => (+params.forceLook || random() > .05) ? -HALF_PI + random(-HALF_PI, HALF_PI) : random(TWO_PI),
              }
            }
          }))
        }

        // Contains all objects in random draw order
        space.store.things = []
        space.store.things.push(...space.store.trees, ...things)
        space.store.things = shuffle(space.store.things)
      }
    })
  },

  /**
   * Expanding rings
   */
  draw: function () {
    const space = this.moar
    const canvas = space.canvas
    space.background()

    // Draw main things
    space.store.topThings.forEach(thing => {
      thing.draw()
    })

    // Draw trees and things
    space.store.things.forEach(thing => {
      // Draw trees
      if (thing instanceof Moar.FractalTree) {
        canvas.drawingContext.shadowColor = '#000000aa'
        canvas.drawingContext.shadowBlur = 20
        thing.draw()
        canvas.image(thing.canvas, 0, 0)
        canvas.drawingContext.shadowBlur = 0

        thing.things.forEach(eye => {
          eye.draw()
        })
        
      // Draw things
      } else {
        const frame = Moar.wrap(Moar.getProgress(thing.store.speed) + thing.store.framecountShift, 0, 1)
        thing.eyeOffset.y = sin(frame * TWO_PI) * thing.size/8 - thing.size/8
        
        const numSegments = 32
        const thetaStep = PI / numSegments
        const waveDepth = 0.075
        const r = thing.size * 1.25
        const wrapAngle = PI/2 + thetaStep * 4
        
        // Draw the jellyfish
        let s = [...thing.store.color]
        s.pop()
        canvas.strokeWeight(thing.store.strokeWeight)
        canvas.stroke(s)
        canvas.fill(thing.store.color)
    
        canvas.push()
          canvas.translate(thing.x, thing.y + thing.size / 3)
          canvas.beginShape()
          // Right side
          for (let a = 0; a < PI; a += thetaStep) {
            const p1 = getJellyVertex(a, r, wrapAngle, thetaStep)
            const p2 = getJellyVertex(a + thetaStep, r, wrapAngle, thetaStep)
            const n1 = getJellyNormal(a, r, wrapAngle, thetaStep)
            const n2 = getJellyNormal(a + thetaStep, r, wrapAngle, thetaStep)

            p1.x += n1.x * sin(-frame * TWO_PI + p1.y * waveDepth) * thing.store.aggressiveness
            p1.y += n1.y * sin(-frame * TWO_PI + p1.y * waveDepth) * thing.store.aggressiveness
            p2.x += n2.x * sin(-frame * TWO_PI + p2.y * waveDepth) * thing.store.aggressiveness
            p2.y += n2.y * sin(-frame * TWO_PI + p2.y * waveDepth) * thing.store.aggressiveness

            canvas.vertex(p1.x, p1.y)
          }
          // Left side
          for (let a = PI; a > 0; a -= thetaStep) {
            const p1 = getJellyVertex(a, r, wrapAngle, thetaStep)
            const p2 = getJellyVertex(a + thetaStep, r, wrapAngle, thetaStep)
            const n1 = getJellyNormal(a, r, wrapAngle, thetaStep)
            const n2 = getJellyNormal(a + thetaStep, r, wrapAngle, thetaStep)

            p1.x += n1.x * sin(-frame * TWO_PI + p1.y * waveDepth) * thing.store.aggressiveness
            p1.y += n1.y * sin(-frame * TWO_PI + p1.y * waveDepth) * thing.store.aggressiveness
            p2.x += n2.x * sin(-frame * TWO_PI + p2.y * waveDepth) * thing.store.aggressiveness
            p2.y += n2.y * sin(-frame * TWO_PI + p2.y * waveDepth) * thing.store.aggressiveness

            canvas.vertex(-p1.x, p1.y)
          }
          canvas.endShape(CLOSE)

        canvas.pop()
        thing.draw()
      }

      image(canvas, space.x, space.y)
    })

    // Frame
    canvas.push()
    canvas.noFill()
    canvas.stroke(colors[6])
    canvas.strokeWeight(_strokeWeight)
    canvas.rect(_strokeWeight / 4, _strokeWeight / 4, space.width - _strokeWeight / 2, space.height - _strokeWeight / 2)
    canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, space.width - _strokeWeight / 2, space.height - _strokeWeight / 2)
    canvas.pop()

    // Trees
    space.store.trees.forEach(tree => {
      tree.draw()
      canvas.drawingContext.shadowColor = 'black'
      canvas.drawingContext.shadowBlur = 10
      canvas.image(tree.canvas, 0, 0, space.width, space.height)
    })
    canvas.drawingContext.shadowBlur = 0
    
    // Frame
    canvas.push()
    canvas.noFill()
    canvas.stroke(colors[6])
    canvas.strokeWeight(_strokeWeight)
    canvas.rect(_strokeWeight / 4, _strokeWeight / 4, space.width - _strokeWeight / 2, space.height - _strokeWeight / 2)
    canvas.rect(_strokeWeight / 4, -_strokeWeight / 4, space.width - _strokeWeight / 2, space.height - _strokeWeight / 2)

    canvas.rect(-_strokeWeight / 2, -_strokeWeight / 4, space.width - _strokeWeight / 2, space.height - _strokeWeight / 2)
    canvas.rect(_strokeWeight / 2, -_strokeWeight / 4, space.width - _strokeWeight / 2, space.height - _strokeWeight / 2)
    canvas.pop()
  }
}

// @see http://marcinignac.com/blog/cindermedusae-making-generative-creatures/
function getJellyVertex (a, r, wrapAngle, thetaStep) {
  const p = {x: 0, y: 0}
  const smoothRange = thetaStep * 3

  if (a < wrapAngle) {
    p.x = r * cos(a - PI/2)
    p.y = r * sin(a - PI/2)
  } else {
    if (a <= wrapAngle + smoothRange + 0.01) {
      const t = map(a, wrapAngle, wrapAngle + smoothRange, 0, PI/2)
      p.x = r * cos(a - PI/2)
      p.y = r * sin(wrapAngle - PI/2) + r * sin(t)
    } else {
      const t = map(a, wrapAngle + smoothRange, PI, PI/2, 0)
      p.x = 0.75 * r * cos(t - PI/2)
      p.y = 0.75 * r * sin(t - PI/2) + r * .5
    }
  }

  return p
}

function getJellyNormal (a, r, wrapAngle, thetaStep, amount = 10) {
  const p1 = getJellyVertex(a, r, wrapAngle)
  const p2 = getJellyVertex(a - thetaStep/2, r, wrapAngle)
  const n = {x: 0, y: 0}

  n.x = -(p2.y - p1.y)
  n.y = p2.x - p1.x

  return normalizeNormal(n, amount)
}

function normalizeNormal (vec, newLen = 1) {
  const len = sqrt(vec.x * vec.x + vec.y * vec.y)

  if (len === 0) {
    return vec
  }

  vec.x /= len
  vec.y /= len

  vec.x *= newLen
  vec.y *= newLen

  return vec
}