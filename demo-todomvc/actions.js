define(['jframework'], function ($$) {

  var actions = $$.action([
    'addTodo',
    'removeTodo',
    'toggleTodo',
    'updateTodo',
    'toggleAllTodos',
    'filter'
  ]);

  return actions;

});