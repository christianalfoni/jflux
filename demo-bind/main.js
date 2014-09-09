$$.config({autoRoute: false});

var BindedComponent = $$.component(function (template) {

  var newTodo = {
    title: '',
    completed: false
  };

  this.bind(newTodo, 'title', ':text');
  this.bind(newTodo, 'completed', ':checkbox');
  this.render(function () {
    return template(
      '<div>',
        '<form>',
          '<input type="text" name="title" value="' + newTodo.title + '"/>',
          '<div>',
            newTodo.title,
          '</div>',
          '<input type="checkbox"' + (newTodo.completed ? 'checked' : '') + '"/>',
          '<div>',
            'completed: ' + newTodo.completed,
          '</div>',
        '</form>',
      '</div>'
    );
  });

});

$(function () {
  $$.render(BindedComponent(), 'body');
});