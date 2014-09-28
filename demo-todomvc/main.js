require.config({
  paths: {
    'jflux': '../build/jflux',
    'jquery': 'https://code.jquery.com/jquery-2.1.1.min'
  }
});

require(['jflux', 'components/Todomvc', 'actions'], function ($$, Todomvc, actions) {

  $$.config({
    baseUrl: '/demo-todomvc',
    popstate: false
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