export default function (config) {
/*
"Arriving Home 🚂🚃"

Happy arrivals,
one by one to home sweet home.
The train goes choo choo 🚂🌈
---
Sketched for @sableRaph's Weekly Creative Coding Challenge: https://openprocessing.org/curation/78544
Passengers are placed using Starfield technique from Coding Train: https://www.youtube.com/watch?v=17WoOqgXsRM
---
Devlog (coming soon): https://midifungi.com/sketches/midifungi/4.html
*/


/**
 * Draws the trees in inverse perspective (further back are larger)
 */
Layers.create(() => {
  class Tree {
    constructor () {
      this.emoji = random(config.trees || ['🌴', '🌳', '🌲', '🌵'])
      this.size = random(minSize*.1, minSize*.5)
      this.x = random(-this.size, width + this.size)
      this.y = height - this.size
    }
  }

  class Cloud {
    constructor () {
      this.emoji = random(config.clouds || ['☁️'])
      this.size = random(minSize*.1, minSize*.5)
      this.x = random(-this.size, width+this.size)
      this.y = random(height/2)
    }
  }
  
  new Layer({
    id: 'trees',
    noLoop: true,

    store: {
      trees: []
    },

		// Right click to change background color
		// If you have a MIDI device then you can also map it!
    menu: {
      bg: {min: 4, max: 6}
    },
    
    setup () {
			// Shadows don't seem to work with emojis over a certain size
      drawingContext.shadowBlur = 5
      drawingContext.shadowColor = '#000'
      this.store.clouds = []
      this.store.trees = []

			// Create clouds/trees
      for (let i = 0; i < random(0, minSize/10); i++) {
        this.store.clouds.push(new Cloud())
      }
      for (let i = 0; i < maxSize; i++) {
        $trees.push(new Tree())
      }
    },
    
    draw () {
      background(Layers.default.colors[$bg])
      // sort by size
      $trees.sort((a, b) => b.size - a.size)
      $clouds.sort((a, b) => b.size - a.size)
      
      $clouds.forEach(cloud => {
        textSize(cloud.size)
        text(cloud.emoji, cloud.x, cloud.y)
      })
      $trees.forEach(tree => {
        textSize(tree.size)
        text(tree.emoji, tree.x, tree.y)
      })
    }
  })      
})
}