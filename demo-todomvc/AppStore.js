define(['jflux', 'actions'], function ($$, actions) {

  return $$.store({
    todos: [],
    filter: {
      completed: true,
      active: true
    },
    actions: [
      actions.addTodo,
      actions.removeTodo,
      actions.toggleTodo,
      actions.updateTodo,
      actions.toggleAllTodos,
      actions.filter
    ],
    getTodo: function (todo) {
      var date = todo.date;
      return this.todos.filter(function (todo) {
        return todo.date === date;
      })[0];
    },
    addTodo: function (title) {
      this.todos.push({
        title: title,
        completed: false,
        date: Date.now()
      });
      this.emitChange(); 
    },
    removeTodo: function (todo) {
      var originalTodo = this.getTodo(todo);
      this.todos.splice(this.todos.indexOf(originalTodo), 1);
      this.emitChange();
    },
    toggleTodo: function (todo) {
      var originalTodo = this.getTodo(todo);
      originalTodo.completed = todo.completed;
      this.emitChange();
    },
    updateTodo: function (todo) {
      var originalTodo = this.getTodo(todo);
      originalTodo.title = todo.title.trim();
      if (!originalTodo.title) {
        this.todos.splice(this.todos.indexOf(originalTodo), 1);
      }
      this.emitChange();
    },
    toggleAllTodos: function (completed) {
      this.todos.forEach(function (todo) {
        todo.completed = completed;
      });
      this.emitChange();
    },
    filter: function (options) {
      filter = options;
      this.emitChange();
    },
    exports: {
      getTodos: function () {
        return this.todos.filter(function (todo) {
          return (filter.completed && todo.completed) || (filter.active && !todo.completed);
        })
      },
      getRemainingCount: function () {
        return this.todos.filter(function (todo) {
          return !todo.completed;
        }).length;   
      },
      allCompleted: function () {
        return this.todos.filter(function (todo) {
          return !todo.completed;
        }).length === 0;
      }
    }
  });

});