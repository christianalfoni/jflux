var $$ = require('jflux');

describe('HelloWorld', function () {

  it('should be an H1 element with the text "Hello world!"', function (done) {

    $$.test('app/HelloWorld.js', function (HelloWorld, $) {

      $$.render(HelloWorld(), 'body');
      expect($('h1').text()).toBe('Hello world!');
      done();

    });

  });

});