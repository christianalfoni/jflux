$$.config({autoRoute: false});

var Dropdown = $$.component(function (template) {

  this.plugin('dropdown');
  this.render(function () {
    var items = (this.props.items || []).map(function (item) {
      if (item) {
        return template(
          '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">' + item + '</a></li>'
        );
      } else {
        return template(
          '<li role="presentation" class="divider"></li>'
        );
      }

    }, this);
    return template(
      '<div class="dropdown">',
        '<a data-toggle="dropdown" href="#">' + this.props.title + '</a>',
        '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">',
        items,
        '</ul>',
      '</div>'
    );
  });

});

$(function () {
  $$.render(Dropdown({title: 'Wazup?', items: ['foo', null, 'bar']}), 'body');
});