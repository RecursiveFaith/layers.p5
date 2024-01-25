Layers.create(() => {
  new Layer({
    id: 'towers',

		colors: ['#FF618B', '#FF9D00', '#FAD000', '#2CA300', '#2EC2B3', '#5D38F0', '#00193D', '#ffffff'],
    colorMode: RGB,
    fps: 10,

    menu: {
      angle: {min: -PI, max: PI, value: 0, step: .01},
      x: {min: -5, max: 5, default: 0, step: .01},
      y: {min: -5, max: 5, default: 0, step: .01},
      z: {min: -10, max: 10, default: 5, step: .5},
      rotX: {min: -180, max: 180, default: 0, step: 1},
      rotY: {min: -180, max: 180, default: 0, step: 1},
      rotZ: {min: -180, max: 180, default: 0, step: 1},
      scale: {min: .5, max: 5, default: 1, step: .01},
      edgeColor: {min: 0, max: 6, step: 1},
      frameColor: {min: 0, max: 6, step: 1},
    },
    $: {
      scribble: new Layers.scribble.$.Scribble(),
      numTowers: 0,
      towers: [],
      rects: [],

      // 2D Cube
      vertices: [
        [-1, -1, -1],
        [-1, -1, 1],
        [-1, 1, -1],
        [-1, 1, 1],
        [1, -1, -1],
        [1, -1, 1],
        [1, 1, -1],
        [1, 1, 1]
      ],
      edges: [
        [0, 1],
        [0, 2],
        [0, 4],
        [1, 3],
        [1, 5],
        [2, 3],
        [2, 6],
        [3, 7],
        [4, 5],
        [4, 6],
        [5, 7],
        [6, 7]
      ],
      faces: [

      ]
    },

    setup () {
      randomSeed(Date.now())
      
      drawingContext.shadowOffsetX = -1;
      drawingContext.shadowOffsetY = -1;
      drawingContext.shadowBlur = 3;
      drawingContext.shadowColor = '#000000fe'
    },

    draw () {
      clear()
      randomSeed(Date.now())
      $rotY += 10

      // Loop through the edges
      strokeWeight(10)
      push()
        translate(width/2, height/2)
        $edges.forEach(edge => {
          // Get the start and end vertices of the edge
          let v1 = $vertices[edge[0]]
          let v2 = $vertices[edge[1]]

          let rotX = $rotX * PI / 180
          let rotY = $rotY * PI / 180
          let rotZ = $rotZ * PI / 180
          
          // Create a quaternion from Euler angles
          let rotation = Quaternion.fromEuler(rotZ, rotX, rotY, 'ZXY')
          
          // Apply quaternion rotation to the vertices
          v1 = rotation.rotateVector(v1)
          v2 = rotation.rotateVector(v2)          
          
          // Apply perspective projection to get the screen coordinates
          let x1 = (v1[0] + $x) / (v1[2] + $z) * width*$scale
          let y1 = (v1[1] + $y) / (v1[2] + $z) * height*$scale
          let x2 = (v2[0] + $x) / (v2[2] + $z) * width*$scale
          let y2 = (v2[1] + $y) / (v2[2] + $z) * height*$scale

          // Set a random fill color
          stroke(this.colors[$edgeColor])
          $scribble.scribbleLine(x1, y1, x2, y2)
        })

        // Define the faces of the cube as arrays of vertex indices
        var faces = [
          [0, 1, 3, 2], // front
          [4, 5, 7, 6], // back
          [0, 1, 5, 4], // bottom
          [2, 3, 7, 6], // top
          [0, 2, 6, 4], // left
          [1, 3, 7, 5] // right
        ];

        // Loop through the faces
        faces.forEach((face, i) => {
          // Convert the current rotation angles to radians
          let rotX = $rotX * PI / 180;
          let rotY = $rotY * PI / 180;
          let rotZ = $rotZ * PI / 180;
          
          // Create a quaternion from Euler angles
          let rotation = Quaternion.fromEuler(rotZ, rotX, rotY, 'ZXY');

          // Get the screen coordinates of the face vertices
          let xCoords = face.map(v => {
            // Apply quaternion rotation to the vertex
            v = rotation.rotateVector($vertices[v]);
            // Apply perspective projection to get the screen coordinate
            return (v[0] + $x) / (v[2] + $z) * width*$scale;
          });
          
          let yCoords = face.map(v => {
            // Apply quaternion rotation to the vertex
            v = rotation.rotateVector($vertices[v]);
            // Apply perspective projection to get the screen coordinate
            return (v[1] + $y) / (v[2] + $z) * height*$scale;
          });

          // Draw the hachure with a random gap and angle
          strokeWeight(2)
          stroke('#fff')
          $scribble.scribbleFilling(xCoords, yCoords, random(20, 100), random(360))
          $scribble.scribbleFilling(xCoords, yCoords, random(20, 100), random(360))
          $scribble.scribbleFilling(xCoords, yCoords, random(20, 100), random(360))          

          // // Get the screen coordinates of the face vertices
          // let xCoords = face.map(v => ($vertices[v][0] + $x) / ($vertices[v][2] + $z) * width*$scale);
          // let yCoords = face.map(v => ($vertices[v][1] + $y) / ($vertices[v][2] + $z) * height*$scale);

          // // Draw the hachure with a random gap and angle
          // strokeWeight(2)
          // stroke('#fff')
          // $scribble.scribbleFilling(xCoords, yCoords, random(20, 100), random(360))
          // $scribble.scribbleFilling(xCoords, yCoords, random(20, 100), random(360))
          // $scribble.scribbleFilling(xCoords, yCoords, random(20, 100), random(360))
        })
      pop()

      // Frame
      push()
        stroke(this.colors[$frameColor])
        const margin = minSize*.03
        strokeWeight(minSize*.0045)
        $scribble.scribbleRect(width/2, height/2, this.width-margin, this.height-margin)
      pop()
    
      // Refresh texturizer
      if (Layers.texturizer01) {
        Layers.mergeLayers(Layers.texturizer01)
        Layers.texturizer01.draw()
      }
    }
  })
}, ['scribble', 'bg', 'quaternion'])

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
    $rects.push({
      shape: 'scribbleRect',
      stroke: random(Layers.towers.colors),
      w, h,
      inputs: [x, y, w, h]
    })
    $rects.push({
      shape: 'scribbleFilling',
      stroke: random(Layers.towers.colors),
      w, h,
      inputs: [[x-w/2, x+w/2, x+w/2, x-w/2], [y-h/2, y-h/2, y+h/2, y+h/2], random(1, 20), random(360)]
    })
    $rects.push({
      shape: 'scribbleFilling',
      stroke: random(Layers.towers.colors),
      w, h,
      inputs: [[x-w/2, x+w/2, x+w/2, x-w/2], [y-h/2, y-h/2, y+h/2, y+h/2], random(1, 20), random(360)]
    })
    $rects.push({
      shape: 'scribbleFilling',
      stroke: random(Layers.towers.colors),
      w, h,
      inputs: [[x-w/2, x+w/2, x+w/2, x-w/2], [y-h/2, y-h/2, y+h/2, y+h/2], random(1, 20), random(360)]
    })
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
