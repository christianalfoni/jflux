var $$ = require('jflux');

var HelloWorld = $$.component({

  render: function (compile) {
    return compile(
      '<h1>',
        'Hello world!',
      '</h1>'
    );
  }

});

module.exports = HelloWorld;