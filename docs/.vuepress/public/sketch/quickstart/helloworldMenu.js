new Layer({
  menu: {
    // Slider shorthand
    // Same as {type: 'slider', min: 0, max: 1, step: .001}
    // step = 1 if value > 1 else .001
    param1: 1,
    
    // Slider shorthand. Same as {type: 'slider', min: 0, max: 10, step: 1}
    param2: {max: 10, resetOnChange: true},
    
    // Slider defaults
    param3: {
      type: 'slider',
      min: 0,
      max: 10,
      step: 1,
      default () {return ~~random(this.min, this.max)},
      onChange () {},
      resetOnChange: false, // Whether to complete restart the layer or not
    },

    // Dropdown shorthand
    param4: ['option1', 'option2', 'option3'],

    // Dropdown defaults
    param5: {
      type: 'list',     // Not needed if options are defined
      options: [
        'option1',
        'option2',
        'option3'
      ],
      default () {return ~~random(this.min, this.max)},
      onChange () {},
      resetOnChange: false,
    },
  },

  draw () {
    background(200)
    text($param1, 0, 20)
    text($param2, 0, 40)
    text($param3, 0, 60)
    text($param4, 0, 80)
    text($param5, 0, 100)
  }
})