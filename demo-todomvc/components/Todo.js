define(['jframework', 'AppState', 'actions'], function ($$, AppState, actions) {

  return $$.component(function (template) {

    var isEditing = false;

    this.removeTodo = function ($el) {
      actions.removeTodo(this.props.todo);
    };

    this.toggleTodo = function ($el) {
      actions.toggleTodo(this.props.todo, $el.is(':checked'));  
    };

    this.editTodo = function ($el) {
      isEditing = true;
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
      isEditing = false;
      this.update();
    };

    this.listenTo('click', '.destroy', this.removeTodo);
    this.listenTo('change', '.toggle', this.toggleTodo);
    this.listenTo('dblclick', this.editTodo);
    this.listenTo('blur', ':text', this.stopEditing);
    this.listenTo('submit', 'form', this.stopEditing);
    this.render(function () {
      var todo = this.props.todo;
      return template(
        '<li id="' + todo.id + '"' + $$.addClass({completed: todo.completed, editing: isEditing}) + '>',
          '<div class="view">',
            '<input class="toggle" type="checkbox"' + (todo.completed ? ' checked' : '') + '/>',
            '<label>',
              todo.title,
            '</label>',
            '<button class="destroy"></button>', 
          '</div>',
          '<form>',
          '<input type="text" value="' + todo.title + '" class="edit"/>',
          '</form>',
        '</li>'
        );
    });

  });

});