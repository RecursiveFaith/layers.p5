// @see https://gorillasun.de/blog/an-algorithm-for-irregular-grids
// @see https://openprocessing.org/sketch/1555985
const createCell = function (tower, x, y, w, h, depth){
  if(depth>0){
    var div = random(0.25, 0.75)
    if(random()>0.5){
      createCell(tower, x, y, w, h*div, depth-.5)
      createCell(tower, x, y+h*div, w, h*(1-div), depth-1)
    }else{
      createCell(tower, x, y, w*div, h, depth-1)
      createCell(tower, x+w*div, y, w*(1-div), h, depth-1)
    }

  }else{
    noFill()
    strokeWeight(minSize*.0065)
    stroke(random(['#FF618B', '#FF9D00', '#FAD000', '#2CA300', '#2EC2B3', '#5D38F0', '#00193D']))
    push()
      translate(w/2, h/2)
      $scribble.scribbleRect(x, y, w, h)
      $scribble.scribbleFilling([x-w/2, x+w/2, x+w/2, x-w/2], [y-h/2, y-h/2, y+h/2, y+h/2], random(1, 20), random(360))
      $scribble.scribbleFilling([x-w/2, x+w/2, x+w/2, x-w/2], [y-h/2, y-h/2, y+h/2, y+h/2], random(1, 20), random(360))
      $scribble.scribbleFilling([x-w/2, x+w/2, x+w/2, x-w/2], [y-h/2, y-h/2, y+h/2, y+h/2], random(1, 20), random(360))
    pop()
  }
}



class Tower {
  constructor (layer) {
    this.width = random(minSize*.55, minSize*.95)
    this.x = layer.width/2 - this.width/2
    this.height = random(minSize*.55, minSize*.95)
    this.depth = ~~random(3, 5)

    createCell(this, this.x, layer.height/2-this.height/2, this.width, this.height, this.depth)
  }
}



Layers.create(() => {
  new Layer({
    id: 'towers',

		colors: ['#FF618B', '#FF9D00', '#FAD000', '#2CA300', '#2EC2B3', '#5D38F0', '#00193D'],
    colorMode: RGB,

    menu: {},
    $: {
      scribble: new Layers.scribble.$.Scribble(),
      numTowers: 0,
      towers: []
    },

    setup () {
      $numTowers = 1//random() > .5 ? ~~random(1, 4) : 1
      
      drawingContext.shadowOffsetX = -1;
      drawingContext.shadowOffsetY = -1;
      drawingContext.shadowBlur = 3;
      drawingContext.shadowColor = '#000000fe'
      
      for (let i = 0; i < $numTowers; i++) {
        $towers.push(new Tower(this))
      }

      // Frame
      push()
        const margin = minSize*.03
        strokeWeight(minSize*.0045)
        $scribble.scribbleRect(width/2, height/2, this.width-margin, this.height-margin)
      pop()
    },

    draw () {}
  })
}, ['scribble', 'bg'])