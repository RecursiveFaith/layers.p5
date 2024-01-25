/*                    {   { ✨
								  { ✨  {
							   {   {                   https://www.twitch.tv/sableraph
(∩｀-´)⊃━☆ﾟ.*・｡ﾟ{  {  for @SableRaph's   #WCCChallenge
							   {   {          theme: 	 float 🎈
								  { ✨  {                https://discord.gg/S8c7qcjw2b
                      {   { ✨

▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

About:

- Flow fields for the clouds:         https://tylerxhobbs.com/essays/2020/flow-fields
- p5.Scribble for balloon hatching:   https://github.com/generative-light/p5.scribble.js/
- Stitching effect is done with:      drawingContext.setLineDash() && drawingContext.shadowBlur()
*/



// This is just "empty" blue background
Layers.ready(() => {
  let rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
  
  new Layer({
    id: 'sky',
		colors: ['#2EC2B3', '#5D38F0', '#00193D', '#ffffff'],
    colorMode: RGB,
    noLoop: true,
    
    menu: {
      bg: {min: 0, max: 2, step: 1, resetOnChange: true},
      fg: {min: 0, max: 2, step: 1, resetOnChange: true},
      shadow: {min: 50, max: 150},
      dashesBg1: {min: 0, max: .05},
      dashesBg2: {min: 0, max: .05},
    },
		
    $: {
      scribble: null,
      seed: Date.now(),
      lines: []
    },

    setup () {
      $scribble = new Layers.scribble.$.Scribble()
      $lines = []
      $seed = Date.now()
      if (random() > .5) $fg = $bg

      // This will create the criss-cross fabric in the background
      for (let n = 0; n < 1; n++) {
        randomSeed($seed)

        // First pass
        let col = [...this.colors[$fg]]
        col[3] = 50
        
        for (let y = 0; y < height; y += random(minSize*.05)) {
          let col = [...this.colors[$fg]]
          col[0] += random(40, 80)
          col[1] += random(40, 80)
          col[2] += random(40, 80)
          $lines.push({
            x1: 0,
            y1: y,
            x2: width,
            y2: y,
            col,
            strokeWeight: random(1, 3)
          })
        }

        for (let x = 0; x < width; x += random(minSize*.05)) {
          let col = [...this.colors[$fg]]
          col[0] += random(40, 80)
          col[1] += random(40, 80)
          col[2] += random(40, 80)
          $lines.push({
            x1: x,
            y1: 0,
            x2: x,
            y2: height,
            col,
            strokeWeight: random(1, 3)
          })
        }

        for (let y = 0; y < height; y += random(minSize*.05)) {
          let col = [...this.colors[$fg]]
          col[0] += random(40, 80)
          col[1] += random(40, 80)
          col[2] += random(40, 80)
          $lines.push({
            x1: 0,
            y1: y,
            x2: width,
            y2: y,
            col,
            strokeWeight: random(1, 3)
          })
        }

        for (let x = 0; x < width; x += random(minSize*.05)) {
          let col = [...this.colors[$fg]]
          col[0] += random(40, 80)
          col[1] += random(40, 80)
          col[2] += random(40, 80)
          $lines.push({
            x1: x,
            y1: 0,
            x2: x,
            y2: height,
            col,
            strokeWeight: random(1, 3)
          })
        }
      }
    },

    draw () {
      background(this.colors[$bg])
      canvas.drawingContext.setLineDash([minSize*$dashesBg1, minSize*$dashesBg2])

      let col = [...this.colors[$bg]]
      col[3] = 50
      
      drawingContext.shadowOffsetX = -1;
      drawingContext.shadowOffsetY = -1;
      drawingContext.shadowBlur = 3;
      drawingContext.shadowColor = rgbToHex(max(0,col[0]-$shadow), max(0,col[1]-$shadow), max(0,col[2]-$shadow))

      // Paper
      $lines.forEach(line => {
        stroke(line.col)
        strokeWeight(line.strokeWeight)
        $scribble.scribbleLine(line.x1, line.y1, line.x2, line.y2)
      })
    }
  })
})