$$.config({autoRoute: false});

var actions = $$.action(['addTodo']);

var Store = $$.store(function () {

  var todos = [];
  var shouldShow = false;

  this.addTodo = function () {

  };

  this.listenTo(actions.addTodo, this.addTodo);

  setTimeout(function () {
    shouldShow = true;
    this.emit('update');
  }.bind(this), 1000);

  setTimeout(function () {
    shouldShow = false;
    this.emit('update');
  }.bind(this), 2000);


  return {
    getTodos: function () {
      return $$.immutable(todos);
    },
    shouldShow: function () {
      return shouldShow;
    }
  };

});

var Component = $$.component({
  value: '',
  events: {
    'click button': 'addTodo'
  },
  bindings: {
    ':text': 'value'
  },
  init: function (props) {
    this.listenTo(Store, 'update', this.update);
  },
  addTodo: function () {
    console.log('I have been clicked!');
  },
  render: function (compile) {
    this.show = Store.shouldShow();
    console.log(this.show);
    return compile(
      '<div $$-show="show">',
        '<h1>Hello world!</h1>',
        '<button>Click me!</button>',
        '<input type="text" $$-value="value"/>',
      '</div>'
    );
  }

});

$(function () {
  $$.render(Component(), 'body');
});