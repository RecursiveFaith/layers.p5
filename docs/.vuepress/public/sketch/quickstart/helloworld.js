new Layer({
  id: 'helloworld',
  noLoop: false,
  
  $: {
    param1: 'hello',
    
    counter: 0,
    param2 () {return ++$counter},

    param3 (str) {return [$param1, str].join(' ')},
  },

  draw () {
    background(200)
    text($param1, 0, 20)
    text($param2(), 0, 40)
    text($param3('world!'), 0, 60)
  }
})