define(['jflux', 'actions'], function ($$, actions) {

  return $$.store(function () {

    var todos = [];
    var filter = {
      completed: true,
      active: true
    };

    var getTodo = function (todo) {
      var date = todo.date;
      return todos.filter(function (todo) {
        return todo.date === date;
      })[0];
    };

    this.addTodo = function (title) {
      todos.push({
        title: title,
        completed: false,
        date: Date.now()
      });
      this.emit('update');
    };

    this.removeTodo = function (todo) {
      var originalTodo = getTodo(todo);
      todos.splice(todos.indexOf(originalTodo), 1);
      this.emit('update');
    };

    this.toggleTodo = function (todo) {
      var originalTodo = getTodo(todo);
      originalTodo.completed = todo.completed;
      this.emit('update');
    };

    this.updateTodo = function (todo) {
      var originalTodo = getTodo(todo);
      originalTodo.title = todo.title.trim();
      if (!originalTodo.title) {
        todos.splice(todos.indexOf(originalTodo), 1);
      }
      this.emit('update');
    };

    this.toggleAllTodos = function (completed) {
      todos.forEach(function (todo) {
        todo.completed = completed;
      });
      this.emit('update');
    };

    this.filter = function (options) {
      filter = options;
      this.emit('update');
    };

    this.listenTo(actions.addTodo, this.addTodo);
    this.listenTo(actions.removeTodo, this.removeTodo);
    this.listenTo(actions.toggleTodo, this.toggleTodo);
    this.listenTo(actions.updateTodo, this.updateTodo);
    this.listenTo(actions.toggleAllTodos, this.toggleAllTodos);
    this.listenTo(actions.filter, this.filter);

    return {
      getTodos: function () {
        return $$.immutable(todos.filter(function (todo) {
          return (filter.completed && todo.completed) || (filter.active && !todo.completed);
        }));
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