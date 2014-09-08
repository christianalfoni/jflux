define(['jframework', 'actions'], function ($$, actions) {

  return $$.component(function (template) {

    this.addTodo = function ($el, event) {
      event.preventDefault();
      var $input = this.$('input');
      actions.addTodo($input.val());
      $input.val('');
    }; 

    this.listenTo('submit', this.addTodo);
    this.render(function () {
      return template(
        '<form id="todo-form">',
          '<input id="new-todo" autofocus/>',
        '</form>'
      );
    });

  });

});