$$.config({autoRoute: false});

var BindedComponent = $$.component({

  newTodo: {
    title: '',
    completed: false
  },
  bindings: {
    ':text': 'newTodo.title',
    ':checkbox': 'newTodo.completed'
  },
  render: function (compile) {

    return compile(
      '<div>',
        '<form>',
          '<input type="text" name="title" $$-value="newTodo.title"/>',
          '<div>',
            this.newTodo.title,
          '</div>',
          '<input type="checkbox" $$-checked="newTodo.completed"/>',
          '<div>',
            'completed: ' + this.newTodo.completed,
          '</div>',
        '</form>',
      '</div>'
    );

  }

});

$(function () {
  $$.render(BindedComponent(), 'body');
});