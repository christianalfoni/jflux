requirejs.config({
  baseUrl: 'app/',
  paths: {
    'jquery': '../vendors/jquery',
    'jflux': '../vendors/jflux'
  }
});

require(['jflux', 'HelloWorld'], function ($$, HelloWorld) {

  $$.route('/', function () {
    $$.render(HelloWorld(), 'body');
  });

  $$.run();

});