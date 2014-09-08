define(['jframework', 'AppState', 'actions', 'components/Todo'], function ($$, AppState, actions, Todo) {

  return $$.component(function (template) {

    this.toggleAll = function ($el) {
      actions.toggleAllTodos($el.is(':checked'));
    };

    this.listenTo(AppState, this.update);
    this.listenTo('change', '#toggle-all', this.toggleAll);
    this.render(function () {

      var todos = AppState.getTodos().map(function (todo) {
        return template(
          Todo({id: todo.id, todo: todo})
        );
      });
      return template(
        '<div>',
          '<input id="toggle-all" type="checkbox"' + (AppState.allCompleted() && todos.length ? ' checked' : '') + '/>',
          '<ul id="todo-list">',
            todos,
          '</ul>',
        '</div>'
      );

    });

  });

});
