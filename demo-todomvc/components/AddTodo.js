define(['jflux', 'actions'], function ($$, actions) {

  return $$.component(function () {

    this.addTodo = function (event) {
      event.preventDefault();
      var $input = this.$('input');
      actions.addTodo($input.val());
      $input.val('');
    }; 

    this.listenTo('submit', this.addTodo);
    this.render = function (compile) {
      return compile(
        '<form id="todo-form">',
          '<input id="new-todo" autofocus autocomplete="false"/>',
        '</form>'
      );
    };

  });

});