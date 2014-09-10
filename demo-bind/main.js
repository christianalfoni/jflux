$$.config({autoRoute: false});

var BindedComponent = $$.component(function () {

  this.newTodo = {
    title: '',
    completed: false
  };

  this.bind(this.newTodo, 'title', ':text');
  this.bind(this.newTodo, 'completed', ':checkbox');
  this.render = function (compile) {
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
  };

});

$(function () {
  $$.render(BindedComponent(), 'body');
});