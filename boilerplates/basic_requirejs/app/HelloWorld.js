define(['jflux'], function ($$) {

  var HelloWorld = $$.component({

    render: function (compile) {
      return compile(
        '<h1>',
          'Hello world!',
        '</h1>'
      );
    }

  });

  return HelloWorld;

});