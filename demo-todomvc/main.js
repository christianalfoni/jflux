require.config({
  paths: {
    'jflux': '../build/jflux',
    'jquery': '../jquery'
  }
});

require(['jflux', 'components/Todomvc', 'actions'], function ($$, Todomvc, actions) {

  $$.config({
    baseUrl: '/demo-todomvc'
  });

  $$.route('/', function () {
    actions.filter({
      completed: true,
      active: true
    });
    $$.render(Todomvc(), 'body');
  });

  $$.route('/active', function () {
    actions.filter({
      completed: false,
      active: true
    });
    $$.render(Todomvc(), 'body');
  });

  $$.route('/completed', function () {
    actions.filter({
      completed: true,
      active: false
    });
    $$.render(Todomvc(), 'body');
  });

  $$.run();

});