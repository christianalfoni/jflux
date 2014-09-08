define(['jframework', 'AppState'], function ($$, AppState) {

  return $$.component(function (template) {

    this.listenTo(AppState, this.update);
    this.render(function () {

      var createRemainingText = function () {
        var remaining = AppState.getRemainingCount();
        return remaining + (remaining === 1 ? ' item' : ' items') + ' remaining';
      };

      return template(
        '<div>',
          '<span id="todo-count">',
            '<strong>',
              createRemainingText(),
            '</strong>',
          '</span>',
          '<ul id="filters">',
            '<li>',
              '<a href="/"' + $$.addClass({selected: $$.path() === '/'}) + '>All</a>',         
            '</li>',
            '<li>',
              '<a href="/active"' + $$.addClass({selected: $$.path() === '/active'}) + '>Active</a>',
            '</li>',
            '<li>',
              '<a href="/completed"' + $$.addClass({selected: $$.path() === '/completed'}) + '>Completed</a>',
            '</li>',
          '</ul>',
        '</div>'
      );

    });

  });

});