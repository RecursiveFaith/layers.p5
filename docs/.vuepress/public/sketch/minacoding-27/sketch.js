Layers.ready(() => {
  const planetSize = 500
  const ringRadius = planetSize / 2 - planetSize/16
  const ringTorusRadius = ringRadius*3
  const ringTorusCenter = planetSize*2.8
  
  new Layer({
    id: '',
    renderer: WEBGL,
    
    menu: {
      ringStart: {min: -PI, max: PI, default: random(-HALF_PI/8, HALF_PI/4), step: .01},
      ringEnd: {min: -PI, max: PI, default: random(HALF_PI/4+HALF_PI/6, HALF_PI), step: .01},
      planetX: {min: 6, max: 12, step: 1},
      planetY: {min: 6, max: 12, step: 1},
      ringX: {min: 3, max: 12, step: 1},
      ringY: {min: 3, max: 5, step: 1},
      camTheta: {min: 0, max: .35, default: random(0, .35)},
      camPhi: {min: -.5, max: 0, default: random(0, .35)},
      camDeltaZ: {min: -height, max: height, default: random(0, .35)},
      camX: {min: -width, max: width, default: random(0, .35)},
      camY: {min: -height, max: height, default: random(0, .35)},
      camZ: {min: height, max: height*2},
    },
    $: {
      rocks: [],
      cam: null
    },

    setup () {
      $cam = createCamera()
      $bg = 6
      
      for (let i = 0; i < random(300, 1000); i++) {
        let angle = random(-PI, PI)
        
        $rocks.push({
          x: cos(angle) * (ringTorusCenter + random(-ringTorusRadius, ringTorusRadius)),
          y: sin(angle) * (ringTorusCenter + random(-ringTorusRadius, ringTorusRadius)),
          z: random(-ringTorusRadius * .7, ringTorusRadius * .7),
          angle: angle,
          rot: 0,
          rotSpeed: random(-1, 1) / 20,
          rotAxis: random(['rotateX', 'rotateY', 'rotateZ']),

          rotX: random(-HALF_PI, HALF_PI),
          rotY: random(-HALF_PI, HALF_PI),
          rotZ: random(-HALF_PI, HALF_PI),
          color: floor(random(6)),
          size: random(.5, 1.5),
          detail: floor(random(3, 6))
        })
      }
    },

    draw () {
      const camPos = createVector($camX, $camY, $camZ)

      background(0)

      // Rainbow pattern
      offscreen.clear()
      offscreen.resizeCanvas(planetSize, planetSize)
      offscreen.noFill()

      let numStripes = 10
      let stripeWidth = ringRadius / numStripes
      let startA = $ringStart// - sin(TWO_PI * this.getProgress(8)) * HALF_PI/3
      let endA = $ringEnd// + sin(TWO_PI * this.getProgress(8)) * HALF_PI/3
  
      offscreen.push()
      offscreen.strokeWeight(stripeWidth+1)
      offscreen.translate(planetSize/2, planetSize/2)
      for (let i = 0; i < numStripes; i++) {
        let c = wrap(i - floor(frameCount/5), 0, this.colors.length-1)
        offscreen.stroke(this.colors[c])
        offscreen.beginShape()
        for (let j = startA-HALF_PI; j < endA-HALF_PI; j += HALF_PI/16) {
          offscreen.vertex(cos(j) * (ringRadius-i*stripeWidth*.5), sin(j) * (ringRadius-i*stripeWidth*.5))
        }
        offscreen.endShape()
      }
      offscreen.pop()
      
      // 3D
      // clear()
      resizeCanvas(width, height)
  
      // Position the camera
      $cam.setPosition($camX, $camZ, $camZ)
      $cam.lookAt(0, 0, 0)
      $cam._orbit($camTheta, $camPhi, $camDeltaZ)
  
      // Planet
      stroke(0)
      push()
      translate(-planetSize, planetSize, 0)
      rotateX(HALF_PI)
      rotateY(TWO_PI * this.getProgress(32))
      sphere(planetSize, $planetX, $planetY)
      pop()
  
      // Rings (Behind rainbow)
      strokeWeight(1)
      stroke(color(0, 0, 0))
      fill(255, 255, 255)
  
      push()
      translate(-planetSize, planetSize, 0)
      rotateZ(startA)
      translate(0, -ringTorusCenter, 0)
      rotateY(-HALF_PI)
      rotateZ(-this.getProgress(8) * TWO_PI)
      torus(ringTorusRadius, 16, $ringX, $ringY)
      pop()
  
      push()
      translate(-planetSize, planetSize, 0)
      rotateZ(endA)
      translate(0, -ringTorusCenter, 0)
      rotateY(-HALF_PI)
      rotateZ(-this.getProgress(8) * TWO_PI)
      torus(ringTorusRadius, 16, $ringX, $ringY)
      pop()
  
      // Rocks
      $rocks.forEach(rock => {
        rock.rot += rock.rotSpeed
  
        if (!(rock.angle > startA-HALF_PI/12 && rock.angle < endA+HALF_PI/12)) {
          push()
          translate(-planetSize, planetSize, 0)
          rotateZ(-HALF_PI)
          translate(rock.x, rock.y, rock.z)
          rotateX(rock.rotX)
          rotateY(rock.rotY)
          rotateZ(rock.rotZ)
          canvas[rock.rotAxis](this.getProgress(8) * TWO_PI)
          fill(this.colors[rock.color])
          sphere(planetSize / 20 * rock.size, rock.detail, rock.detail)
          pop()
        }
      })
  
      // Rainbow
      noStroke()
      push()
      texture(offscreen)
      translate(-planetSize, planetSize, 0)
      plane(planetSize*8, planetSize*8)
      pop()
    }
  })
})