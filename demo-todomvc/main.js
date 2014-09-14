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