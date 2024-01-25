/**
 * Falkor from "The Never Ending Story"
 */
Layers.generate(() => {
  new Layer({
    id: 'falkor',
    colors: ['#fff', '#000', '#f00'],

    menu: {
      color: {max: 2, step: 1},
      stroke: {max: 2, step: 1},
    },

    methods: {
      step: function () {
        // New position
        this.store.angle += 1/this.store.radius*this.store.dir
        this.store.pos[0] += cos(this.store.angle) * this.store.radius
        this.store.pos[1] += sin(this.store.angle) * this.store.radius
  
        // Change direction
        if (this.store.pos[0] < this.store.size+10 || this.store.pos[0] > width-this.store.size-10 || this.store.pos[1] < this.store.size+10 || this.store.pos[1] > height-this.store.size-10) {
          const v1 = createVector(this.store.pos[0], this.store.pos[1])
          const v2 = createVector(width/2, height/2)
          const a = v1.angleBetween(v2)
  
          if (this.angle < a) {
            this.store.angle -= 1/this.store.radius*this.store.dir
          } else {
            this.store.angle += 1/this.store.radius*this.store.dir
          }
        } else {
          if (random() < .05) {
            this.store.dir *= -1
            this.store.radius = random(minSize*.005, minSize*.025)
          }
        }
      },
      
      /**
       * Creates the spine and tapers
       */
      createBody () {
        const spine = this.store.spine
        const joints = this.store.joints = []
        const norms = this.store.norms = []
        const tapers = this.store.tapers = []
  
        // Create joints
        for (let n = 0; n < spine.length - 3; n++) {
          const p = getCurveVertexPoint(spine[n], spine[n+1], spine[n+2], spine[n+3], 1)
          joints.push(p)
        }
  
        // Create normals
        for (let n = 0; n < joints.length - 1; n++) {
          const p0 = createVector(joints[n][0], joints[n][1])
          const p1 = createVector(joints[n+1][0], joints[n+1][1])
          const norm = p1.sub(p0).normalize()
          norms.push(norm)
          tapers.push(0)
        }
  
        // Draw norms and set norm width
        this.offscreen.strokeWeight(minSize * .001)
        norms.forEach((norm, n) => {
          if (n > norms.length-20) {
            tapers[n] = norms.length-20 - n
          } else if (n < 20) {
            tapers[n] = n - 20
          }
        })
      }
    },

    /**
     * Initialize the dragons body
     */
    setup () {
      this.store = {
        len: random(500, 3000),
        
        color: 0,
        stroke: 0,
        
        pos: [random(-width/6, width/6)+width/2, random(-height/6, height/6)+height/2],
        snailSpine: [],
        spine: [],
        slime: [],
        joints: [],
        norms: [],
        tapers: [],
    
        size: minSize*.1,
        dir: 1,
        radius: random(5, 8),
        angle: random(TWO_PI)
      }
      
      // Create snail spine
      for (let i = 0; i < this.store.len; i++) {
        this.step()
        this.store.spine.unshift([...this.store.pos])
      }
      this.store.snailSpine = [...this.store.spine]

      // Create slime spine
      for (let i = 0; i < this.store.slimeLen; i++) {
        this.step()
        this.store.spine.unshift([...this.store.pos])
      }
    },

    draw (offscreen) {
      clear()
      offscreen.clear()

      this.createBody()
      const joints = this.store.joints
      const norms = this.store.norms
      const tapers = this.store.tapers

      // Scales
      for (let n = norms.length-1; n > 0; n--) {
        const norm = norms[n]

        let orthLen = minSize*.05 + tapers[n]*minSize*.003
        let orth = norm.copy().rotate(PI/2)
        const scaleWidth = minSize*.02
        orthLen+=scaleWidth

        // Loop for length of norm
        const steps = ceil(orthLen*2/scaleWidth)
        let curStep = scaleWidth * steps/2 - scaleWidth
        for (let i = ceil(steps/2); i > 0; i--) {
          // Base color
          offscreen.fill(this.colors[this.store.color])
          offscreen.stroke(this.colors[this.store.stroke])
          offscreen.drawingContext.shadowBlur = minSize*.01
          // @todo Use two shadows, one for the scale and a softer one for the whole dragon
          offscreen.drawingContext.shadowColor = '#000'

          // Start from the center and spread out
          // Left
          if (curStep <= 0 && i > 0) {
            offscreen.drawingContext.shadowBlur = 0
          }
          
          offscreen.push()
            offscreen.translate(joints[n][0] + orth.x*curStep, joints[n][1] + orth.y*curStep)
            offscreen.rotate(orth.heading())
            offscreen.ellipse(0, 0, scaleWidth, scaleWidth*2)
          offscreen.pop()

          // Right
          if (curStep > 0) {
            offscreen.push()
              offscreen.translate(joints[n][0] - orth.x*curStep, joints[n][1] - orth.y*curStep)
              offscreen.rotate(orth.heading())
              offscreen.ellipse(0, 0, scaleWidth, scaleWidth*2)
            offscreen.pop()
          }
          curStep -= scaleWidth
        }
        offscreen.drawingContext.shadowBlur = 0
      }

      drawingContext.shadowBlur = minSize*.01
      drawingContext.shadowColor = 'black'
      image(offscreen, 0, 0)

      drawingContext.shadowBlur = 0
    }
  })  
})

/**
 * Get a point along a curve
 * @see https://discourse.processing.org/t/calculating-points-along-a-curvevertex-line/11337
 * 
 * @param p0 {Array} - First control point
 * @param p1 {Array} - Drawing start point
 * @param p2 {Array} - Drawing end point
 * @param p3 {Array} - Last control point
 * @param t {Number} - [0-1] Percentage between p1 and p2
 */
function getCurveVertexPoint (p0, p1, p2, p3, t) {
  const alpha = 0.5
  let px = alpha * ((2 * p1[0]) + (-p0[0]+p2[0]) * t + (2 * p0[0]-5 * p1[0] + 4*p2[0] - p3[0]) * (t * t) + (-p0[0] + 3 * p1[0]-3 * p2[0] + p3[0]) * (t * t * t))
  let py = alpha * ((2 * p1[1]) + (-p0[1]+p2[1]) * t + (2 * p0[1]-5 * p1[1] + 4*p2[1] - p3[1]) * (t * t) + (-p0[1] + 3 * p1[1]-3 * p2[1] + p3[1]) * (t * t * t))
  return [px, py]
}