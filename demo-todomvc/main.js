require.config({
  paths: {
    'jflux': '../lib/jflux',
    'jquery': '../vendors/jquery'
  }
});

require(['jflux', 'components/Todomvc', 'actions'], function ($$, Todomvc, actions) {

  $$.config({
    baseUrl: '/demo-todomvc',
    popstate: false
  });

  $$.route('/', function () {
    $$.render(Todomvc(), 'body');
    actions.filter({
      completed: true,
      active: true
    });
  });

  $$.route('/active', function () {
    $$.render(Todomvc(), 'body');
    actions.filter({
      completed: false,
      active: true
    });
  });

  $$.route('/completed', function () {
    $$.render(Todomvc(), 'body');
    actions.filter({
      completed: true,
      active: false
    });
  });

  $$.run();

});