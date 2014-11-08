/*
 * ACTIONS
 */
var actions = $$.actions(['connect', 'addMessage']);

/*
 * STORE
 */
var MessageStore = $$.store({
  messages: [],
  db: null, 
  actions: [
    actions.connect,
    actions.addMessage
  ],
  connect: function () {
    var view;
    this.db = new Firebase('https://klsyfflspoi.firebaseio-demo.com/messages');
    view = this.db.limit(10);
    view.on('value', function (value) {
      var serverMessages = value.val() || [];
      this.messages = Object.keys(serverMessages).map(function (id) {
        var message = serverMessages[id];
        message.id = id;
        return message;
      }.bind(this)).sort(function (a, b) {
        if (a.date > b.date) {
          return -1;
        } else {
          return 1;
        }
      });
      this.emitChange();
    }.bind(this));
  },
  addMessage: function (text) {
    text = text.trim();
    if (text) {
      this.db.push({
        date: Date.now(),
        text: text
      });
    }
  },
  exports: {
    getMessages: function () {
      return this.messages.filter(function (item) {
        return !!item;
      });
    }
  }
});

/*
 * COMPONENT
 */
var MessagesList = $$.component({

  message: '',
  events: {
    'submit form': 'addMessage'
  },
  bindings: {
    ':text': 'message'
  },
  init: function () {
    this.listenToChange(MessageStore, this.update);
  },
  addMessage: function (event) {
    event.preventDefault();
    actions.addMessage(this.message);
    this.message = '';
    this.update();
  },

  compileMessages: function (compile) {
    return compile(
      '<li $$-id="item.id">',
        this.item.text,
      '</li>'
    );
  },
  render: function (compile) {
    var messages = this.map(MessageStore.getMessages(), this.compileMessages);
    return compile(
      '<div>',
        '<form>',
          '<input $$-value="message"/>',
        '</form>',
        '<ul>',
          messages,
        '</ul>',
      '</div>'
    );
  }

});

/*
 * ROUTING
 */
$$.config({
  baseUrl: '/demo-firebase'
});

$$.route('/', function () {
  actions.connect();
  $$.render(MessagesList(), 'body');
});