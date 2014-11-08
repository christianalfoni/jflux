define(['jflux'], function ($$) {

  var actions = $$.actions([
    'addTodo',
    'removeTodo',
    'toggleTodo',
    'updateTodo',
    'toggleAllTodos',
    'filter'
  ]);

  return actions;

});