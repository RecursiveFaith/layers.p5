export default function () {
Layers.create(() => {
  /**
  * This layer applies Watercanvas.js to the canvas
  */
  let $waterModel
  let $waterCanvas

  new Layer({
    id: 'filter',
    
    menuDisabled: true,
    
    store: {
      model: null,
      canvas: null,
      frames: 0
    },
    
    onDispose () {
      cancelAnimationFrame(this.store.canvas.animFrame)
      clearInterval(this.store.canvas.findFPSInterval)
      this.store.model = null
      this.store.canvas = null
    },
    
    setup () {
      window.pixel = create2DArray(createRadialCanvas(2,2));
      window.raindrop = create2DArray(createRadialCanvas(4,4));
      window.finger = create2DArray(createRadialCanvas(14,14));
      
      // Cap size at 300
      const size = min(width, height, 300)
      if (!$waterModel) {
        
        $waterModel = new window.WaterModel(size, size, {
          resolution: 1,
          interpolate: true,
          damping: 0.985,
          clipping: 5,
          evolveThreshold: 0.05,
          maxFps: 0,
        })
        
        $waterCanvas = new window.WaterCanvas(size, size, 'sketch-002', $waterModel, {
          backgroundImageUrl: Layers.glass.canvas.elt,
          lightRefraction: 20,
          lightReflection: 0.5,
        })
        $waterCanvas.canvas.style.vibility = 'hidden'
        $waterCanvas.canvas.style.opacity = 0
        $waterCanvas.canvas.style.pointerEvents = 'none'
        $waterCanvas.canvas.style.position = 'absolute'
      }

      // Create a bunch of touch points
      for (let i = 0; i < minSize / 10; i++) {
        $waterModel.touchWater(random(size), random(size), 1.5, window.finger)
      }
      $waterModel.setMaxFps(30)
      $model = $waterModel
      $canvas = $waterCanvas
      $model.evolving = true
    },
    
    draw (offscreen) {
      // Stop looping
      if (!this.store.model?.evolving) return
      if ($frames++ > 90) {
        this.store.model.evolving = false
      }

      offscreen.push()
      offscreen.drawingContext.globalCompositeOperation = 'source-over'
      offscreen.drawingContext.drawImage($canvas.canvas, 0, 0)
      offscreen.drawingContext.globalCompositeOperation = 'destination-in'
      offscreen.image(Layers.glass.canvas, 0, 0)
      offscreen.pop()

      // Size fo the draw area
      const size = min(width, height, 300)
      let scale
      if (width > height) {
        scale = height / size
      } else {
        scale = width / size
      }

      let offsetX = (width - size * scale) / 2
      let offsetY = (height - size * scale) / 2
      
      clear()
      image(offscreen, offsetX, offsetY, width*scale, height*scale)
    }
  })
})
}