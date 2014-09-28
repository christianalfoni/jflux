var $$ = require('./../src/jflux.js');

describe("isParam()", function () {
  it("should render a component with only one valid argument", function (done) {

    $$.test(function ($) {

      var Comp = $$.component(function () {
        this.render = function (compile) {
          return compile(
            '<div>Hello world</div>'
          );
        };
      });
      $$.render(Comp(), 'body');
      expect($('div').text()).toBe('Hello world');
      done();
    });

  });
});