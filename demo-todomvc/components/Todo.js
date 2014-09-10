define(['jflux', 'AppState', 'actions'], function ($$, AppState, actions) {

  return $$.component(function () {

    this.isEditing = false;

    this.removeTodo = function ($el) {
      actions.removeTodo(this.props.todo);
    };

    this.toggleTodo = function ($el) {
      actions.toggleTodo(this.props.todo, $el.is(':checked'));  
    };

    this.editTodo = function ($el) {
      this.isEditing = true;
      this.update();
      var $input = $el.find(':text');
      $input.focus();
      $input.val($input.val());
    };

    this.stopEditing = function ($el, event) {
      event.preventDefault();
      var title = this.$(':text').val().trim();
      if (title) {
        actions.updateTodo(this.props.todo, title);
      }
      this.isEditing = false;
      this.update();
    };

    this.listenTo('click', '.destroy', this.removeTodo);
    this.listenTo('change', '.toggle', this.toggleTodo);
    this.listenTo('dblclick', this.editTodo);
    this.listenTo('blur', ':text', this.stopEditing);
    this.listenTo('submit', 'form', this.stopEditing);
    this.render = function (compile) {
      var todo = this.todo = this.props.todo;
      this.itemClass = {completed: todo.completed, editing: this.isEditing};
      return compile(
        '<li $$-id="todo.id" $$-class="itemClass">',
          '<div class="view">',
            '<input class="toggle" type="checkbox" $$-checked="todo.completed"/>',
            '<label>',
              todo.title,
            '</label>',
            '<button class="destroy"></button>', 
          '</div>',
          '<form>',
          '<input type="text" $$-value="todo.title" class="edit"/>',
          '</form>',
        '</li>'
        );
    };

  });

});