define([
    'jframework', 'components/AddTodo', 'components/TodosList', 'components/TodosFooter'
  ], function ($$, AddTodo, TodosList, TodosFooter) {

  return $$.component(function (template) {
    this.render(function () {
      return template(
        '<section id="todoapp">',
          '<header id="header">',
            '<h1>todos</h1>',
            AddTodo(),
          '</header>',
          '<section id="main">',
            TodosList(),
          '</section>',
          '<section id="footer">',
            TodosFooter(),
          '</section>',
        '</section>'
        );
    });
  });

});
