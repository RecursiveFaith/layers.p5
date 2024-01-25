/*
🏗️ This is a work in progress 🏗️
Judge me not on this code, for here be dragons 🐉
-------------------------------------------------
This is being made for @sableRaph's #WCCChallenge
This code was super rushed please don't judge it just it
*/

// Applied to all layers by default
Layers.noLoop = true
Layers.default.colors = ['#000', '#fff', '#ff0000']

// Called automatically and whenever you press "Regenerate All"
Layers.generate(function () {
  new Layer({
    id: 'bg',
    
    // This will get converted into right click menu items
		// You can also map your MIDI to these from the menu
    menu: {
      fill: {step: 1, max: 2, default: 2},
      stroke: {step: 1, max: 2, default: 0},
      strokeWeight: {min: minSize*.00175, max: minSize*.0075},
      spaceY: {min: 2, max: 5},
      size: {min: minSize*.1, max: minSize*.2}
    },
		
    // Called whenever you press "Regenerate Layer"
    setup () {
      // Setup store
      this.store.scale = random(.8, 1.15)
      this.store.offset = {x: random(this.store.sizesize*.5), y: random(this.store.sizesize*.5)}
    },
    
    // All draw commands now point to this layer's canvas!
    draw () {
      const size = this.store.size
			const scale = this.store.scale
      const spaceY = this.store.spaceY
			const xOff = this.store.offset.x
			const yOff = this.store.offset.y
      const cols = width/size+2
      
      clear()
      strokeWeight(this.store.strokeWeight)
      fill(this.colors[this.store.fill])
      
      // Circular pattern
      for (let y = -1; y < height/size*spaceY + 1; y++) {
        for (let x = -1; x < cols; x++) {
          stroke(this.colors[this.store.stroke])
          
          push()
          translate(xOff, yOff)
          translate(x*size + (floor(y)%2 * size/2), y*size/spaceY)
          circle(0, 0, size*scale)
          circle(0, 0, size*scale*.75)
          circle(0, 0, size*scale*.5)
          circle(0, 0, size*scale*.25)
          circle(0, 0, 0)
          pop()
        }
      }
    }
  })
})
