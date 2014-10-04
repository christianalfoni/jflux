define(['jflux', 'actions'], function ($$, actions) {

  return $$.component({

    events: {
      'submit': 'addTodo'
    },
    bindings: {
      ':text': 'title'
    },
    title: '',

    addTodo: function (event) {
      event.preventDefault();
      actions.addTodo(this.title);
      this.title = '';
      this.update();
    },

    render: function (compile) {
      return compile(
        '<form id="todo-form">',
          '<input id="new-todo" autofocus autocomplete="false" $$-value="title"/>',
        '</form>'
      );
    }

  });

});