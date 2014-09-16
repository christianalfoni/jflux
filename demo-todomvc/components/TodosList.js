define(['jflux', 'AppState', 'actions', 'components/Todo'], function ($$, AppState, actions, Todo) {

  return $$.component(function (template) {

    this.toggleAll = function ($el) {
      actions.toggleAllTodos($el.is(':checked'));
    };

    this.compileTodos = function (compile) {
      return compile(
        Todo({id: this.item.id, todo: this.item})
      );
    };

    this.listenTo(AppState, this.update);
    this.listenTo('change', '#toggle-all', this.toggleAll);
    this.render = function (compile) {

      var todos = this.map(AppState.getTodos(), this.compileTodos);

      this.allChecked = AppState.allCompleted() && todos.length > 0;

      return compile(
        '<div>',
          '<input id="toggle-all" type="checkbox" $$-checked="allChecked"/>',
          '<ul id="todo-list">',
            todos,
          '</ul>',
        '</div>'
      );

    };

  });

});
