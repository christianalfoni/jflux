define(['jframework', 'actions'], function ($$, actions) {

  return $$.state(function () {

    var todos = [];
    var filter = {
      completed: true,
      active: true
    };

    var getTodo = function (id) {
      for (var x = 0; x < todos.length; x++) {
        if (todos[x].id == id) {
          return todos[x];
        }
      }
    };

    this.addTodo = function (title) {
      todos.push({
        title: title,
        completed: false,
        id: $$.generateId()
      });
      this.flush();
    };

    this.removeTodo = function (todo) {
      var todo = getTodo(todo.id);
      todos.splice(todos.indexOf(todo), 1);
      this.flush();
    };

    this.toggleTodo = function (todo, completed) {
      var todo = getTodo(todo.id);
      todo.completed = completed;
      this.flush();
    };

    this.updateTodo = function (todo, title) {
      var todo = getTodo(todo.id);
      todo.title = title;
      this.flush();
    };

    this.toggleAllTodos = function (completed) {
      todos.forEach(function (todo) {
        todo.completed = completed;
      });
      this.flush();
    };

    this.filter = function (options) {
      filter = options;
      this.flush();
    };

    this.listenTo(actions.addTodo, this.addTodo);
    this.listenTo(actions.removeTodo, this.removeTodo);
    this.listenTo(actions.toggleTodo, this.toggleTodo);
    this.listenTo(actions.updateTodo, this.updateTodo);
    this.listenTo(actions.toggleAllTodos, this.toggleAllTodos);
    this.listenTo(actions.filter, this.filter);

    this.exports = {
      getTodos: function () {
        return todos.filter(function (todo) {
          return (filter.completed && todo.completed) || (filter.active && !todo.completed);
        });
      },
      getRemainingCount: function () {
        return todos.filter(function (todo) {
          return !todo.completed;
        }).length;
      },
      allCompleted: function () {
        return this.getRemainingCount() === 0;
      }
    };

  });

});