define(['jflux', 'actions'], function ($$, actions) {

  return $$.component({

    isEditing: false,
    events: {
      'dblclick': 'editTodo',
      'click .destroy': 'removeTodo',
      'change .toggle': 'toggleTodo',
      'blur :text': 'stopEditing',
      'submit form': 'stopEditing'
    },
    bindings: {
      ':checkbox': 'props.todo.completed',
      ':text': 'props.todo.title'
    },
    removeTodo: function () {
      actions.removeTodo(this.props.todo);
    },
    toggleTodo: function () {
      actions.toggleTodo(this.props.todo);
    },
    editTodo: function () {
      this.isEditing = true;
      this.update();
      var $input = this.$(':text');
      $input.focus();
      $input.val($input.val());
    },
    stopEditing: function (event) {
      event.preventDefault();
      actions.updateTodo(this.props.todo, this.title);
      this.isEditing = false;
      this.update();
    },

    render: function (compile) {
      this.itemClass = {completed: this.props.todo.completed, editing: this.isEditing};
      return compile(
        '<li $$-class="itemClass">',
          '<div class="view">',
            '<input class="toggle" type="checkbox" $$-checked="props.todo.completed"/>',
            '<label>',
              this.props.todo.title,
            '</label>',
            '<button class="destroy"></button>', 
          '</div>',
          '<form>',
          '<input type="text" $$-value="props.todo.title" class="edit"/>',
          '</form>',
        '</li>'
        );
    }

  });

});