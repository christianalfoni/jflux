$$.config({autoRoute: false});

var Dropdown = $$.component(function () {

  this.plugin('dropdown');
  this.render = function (compile) {
    var items = this.map(this.props.items, function (compile) {
      if (this) {
        return compile(
          '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">' + this + '</a></li>'
        );
      } else {
        return compile(
          '<li role="presentation" class="divider"></li>'
        );
      }

    }, this);
    return compile(
      '<div class="dropdown">',
        '<a data-toggle="dropdown" href="#">' + this.props.title + '</a>',
        '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">',
          items,
        '</ul>',
      '</div>'
    );
  };

});

$(function () {
  $$.render(Dropdown({title: 'Wazup?', items: ['foo', null, 'bar']}), 'body');
});