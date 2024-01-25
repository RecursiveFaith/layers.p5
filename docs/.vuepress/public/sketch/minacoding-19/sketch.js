Layers.ready(() => {
  new Layer({
    id: 'walkers',
		colors: ['#FF618B', '#FF9D00', '#FAD000', '#2CA300', '#2EC2B3', '#5D38F0', '#00193D'],
    colorMode: 'rgb',
    renderer: WEBGL,
    // pixelDensity: .25,
    // noLoop: true,

    menu: {
      blur: {min: 0, max: 10}, step: .01,
      camX: {min: 0, max: 0, step: .01, default: 0},
      camY: {min: 0, max: height, step: .01, default: 0},
      lookAtX: {min: -width*.04, max: width*.04, step: .01},
      lookAtY: {min: 0, max: -height, step: .01, default: 0},
      camElev: {min: 0, max: .5, step: .01}
    },
    $: {
      focus: null,
      walkers: [],
      cars: [],
      colorVariation: 0,
    },

    setup () {
      $walkers = []
      $colorVariation = 1//~~random(2)
      $bg = 6
      $camX = random(-maxSize*.25, maxSize*.25)
      
      for (let i = 0; i < 15; i++) {
        this.createNewWalker()
      }
      $focus = $walkers[0]
      clear()

      // Cars
      $cars = []
      for (let i = 0; i < 6; i++) {
        this.createCar()
      }
    },

    draw () {
      background(this.colors[6])
      camera($camX, -$camY, 0, $lookAtX, $lookAtY, -minSize, 0, 1, 0)

      // Draw cars
      $cars.forEach((car, n) => {
        let mappedCol = map(car.z, -maxSize*3, 0, 0, 255, true)
        let lerpedCol = lerpColor(color(this.colors[6]), color(car.color), mappedCol/255)
        const tintedColor = [...lerpedCol.levels]
        
        push()
          translate(car.x, 0, car.z)
          rotateY(PI)
          fill(tintedColor)
          noStroke()
          box(car.width, car.height, car.len)
        pop()
        car.z -= car.speed
        if (car.z < -maxSize*10) {
          $cars.splice(n, 1)
          this.createCar()
        }
      })

      // Draw sidewalk
      noFill()
      stroke(255)
      strokeWeight(minSize*.005)
      for (let i = 0; i < 20; i++) {
        push()
          let mappedCol = map(-i*maxSize*.5, -maxSize*4, 0, 0, 255, true)
          let lerpedCol = lerpColor(color(this.colors[6]), color('#fff'), mappedCol/255)
          const tintedColor = [...lerpedCol.levels]
          stroke(tintedColor)
        
          translate(-maxSize*.5, maxSize*.25, -maxSize*.5 * i)
          rotateX(PI/2)
          // translate(0, 0, 0)
          // rotate(PI/2)
          plane(maxSize*.5, maxSize*.5)
          translate(maxSize*.5, 0, 0)
          plane(maxSize*.5, maxSize*.5)
          translate(maxSize*.5, 0, 0)
          plane(maxSize*.5, maxSize*.5)
        pop()
      }
      
      // Draw Walkers
      // Sort by distance from camera, considering cameras point of view
      $walkers.sort((a, b) => {
        const aDist = dist(a.x, 0, a.z, $camX, 0, $camY)
        const bDist = dist(b.x, 0, b.z, $camX, 0, $camY)
        return aDist - bDist
      })
      $walkers.forEach((walker) => {
        this.drawWalker(walker)
      })
    },

    methods: {
      /**
       * Color variations
       */
      pickColor () {
        let colors = [...this.colors]
        let col
        
        switch ($colorVariation) {
          case 0:
            col = random() > .9 ? [255, 0, 0] : [255, 255, 255]
          break
          default:
            colors.splice(6, 1)
            col = random(colors)
        }
        
        return col
      },
      
      /**
       * Create a new walker
       */
      createNewWalker (x, z) {
        const speed = random(1, 2)
        const walker = new Layers.bmwalker.$.BMWalker()

        x = x || random(-maxSize*.22, maxSize*.22)
        z = z || random(-maxSize*3, maxSize*1)
        // Make sure x is not too close to zero
        // if (x > $camX && x < $camX+width*.05) x += width*.05
        // if (x < $camX && x > $camX-width*.05) x -= width*.05

        $walkers.push({
          x,
          z,
          height: random(minSize/2.5/2, minSize/2.5),
          bmw: walker,
          speed,
          color: this.pickColor(),
          thickness: random(minSize*.045, minSize*.1),
          remove () {
            $walkers.splice($walkers.indexOf(this), 1)
          }
        })

        walker.setSpeed(speed)
        walker.setWalkerParam(random(walker.minBodyStructure, walker.maxBodyStructure), random(walker.minWeight, walker.maxWeight), random(walker.minNervousness, walker.maxNervousness), random(walker.minHappiness, walker.maxHappiness))
        walker.setTranslationParam(true)
      },        
      
      /**
       * Draw the walker
       */
      drawWalker (walker) {
        const markers = walker.bmw.getMarkers(walker.height)
        const head = markers[0]

        // Remove if out of screen
        if (head.z + walker.z > maxSize*.65) {
          walker.remove()
          this.createNewWalker(0, -maxSize*3)
        }

        // Draw limbs
        let mappedCol = map(head.z + walker.z, -width*3, 0, 0, 255, true)
        let lerpedCol = lerpColor(color(this.colors[6]), color(walker.color), mappedCol/255)
        const tintedColor = [...lerpedCol.levels]
        const lineMarkers = walker.bmw.getLineMarkers(walker.height)
        lineMarkers.forEach(m => {
          stroke(tintedColor)
          strokeWeight(walker.thickness)
          line(m[0].x + walker.x, m[0].y, m[0].z + walker.z, m[1].x + walker.x, m[1].y, m[1].z + walker.z)
        })
      },

      /**
       * Create a new car
       */
      createCar () {
        const speed = random(minSize*.1, minSize*.3)
        $cars.push({
          speed,
          color: lerpColor(color(this.colors[6]), color('#fff'), .35).levels,
          x: random(-maxSize*3, -maxSize*.35)-minSize*1.5,
          z: random(maxSize, maxSize*3),
          width: random(minSize*.75, minSize),
          len: random(minSize*1.5, minSize*2.5),
          height: random(minSize*.75, minSize*1.5),
        })
      }
    }
  })
})