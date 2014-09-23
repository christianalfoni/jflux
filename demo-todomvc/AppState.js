define(['jflux', 'actions'], function ($$, actions) {

  return $$.state(function () {

    var todos = [];
    var filter = {
      completed: true,
      active: true
    };

    this.addTodo = function (title) {
      todos.push({
        title: title,
        completed: false
      });
      this.flush();
    };

    this.removeTodo = function (todo) {
      todos.splice(todos.indexOf(todo), 1);
      this.flush();
    };

    this.toggleTodo = function (todo, completed) {
      todo.completed = completed;
      this.flush();
    };

    this.updateTodo = function (todo, title) {
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