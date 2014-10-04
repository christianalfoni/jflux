$$.config({autoRoute: false});

var Dropdown = $$.component({
  compileOptions: function (compile) {
    if (this.item === null) {
      return compile(
        '<li role="presentation" class="divider"></li>'
      );
    } else {
      return compile(
          '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">' + this.item + '</a></li>'
      );
    }
  },
  render: function (compile) {
    var items = this.map(this.props.items, this.compileOptions);
    return compile(
      '<div class="dropdown">',
        '<a data-toggle="dropdown" href="#">' + this.props.title + '</a>',
        '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">',
          items,
        '</ul>',
      '</div>'
    );
  }
});

$(function () {
  $$.render(Dropdown({title: 'Wazup?', items: ['foo', null, 'bar']}), 'body');
});