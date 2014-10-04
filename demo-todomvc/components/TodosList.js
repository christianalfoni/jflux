define(['jflux', 'AppStore', 'actions', 'components/Todo'], function ($$, AppStore, actions, Todo) {

  return $$.component({
    allChecked: false,
    events: {
      'change #toggle-all': 'toggleAll'
    },
    init: function () {
      this.listenTo(AppStore, 'update', this.update);
    },
    toggleAll: function (event) {
      var isChecked = $(event.currentTarget).is(':checked');
      actions.toggleAllTodos(isChecked);
    },
    compileTodos: function (compile) {
      return compile(
        Todo({todo: this.item})
      );
    },
    render: function (compile) {
      var todos = this.map(AppStore.getTodos(), this.compileTodos);
      this.allChecked = AppStore.allCompleted() && todos.length > 0;
      return compile(
        '<div>',
          '<input id="toggle-all" type="checkbox" $$-checked="allChecked"/>',
          '<ul id="todo-list">',
            todos,
          '</ul>',
        '</div>'
      );

    }

  });

});
