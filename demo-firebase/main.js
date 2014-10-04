/*
 * ACTIONS
 */
var actions = $$.action(['addMessage']);

/*
 * STORE
 */
var MessageStore = $$.store(function () {

  var messages = [];
  
  // Connecting to Firebase
  var db = new Firebase('https://klsyfflspoi.firebaseio-demo.com/messages');

  // Creating a view to only show last 10 messages
  var view = db.limit(10);
  
  // Firebase will trigger this event, giving the last
  // 10 messages at any time. The messages are a hash,
  // so we have to convert them to an array, sorting by date
  view.on('value', function (value) {
    messages = value.val() || {};
    messages = Object.keys(messages).map(function (id) {
      var message = messages[id];
      message.id = id;
      return message;
    }).sort(function (a, b) {
      if (a.date > b.date) {
        return -1;
      } else {
        return 1;
      }
    });
    this.emit('update');
  }.bind(this));

  this.addNewMessage = function (text) {
    text = text.trim();
    if (text) {
      db.push({
        date: Date.now(),
        text: text
      });
    }
  };

  this.listenTo(actions.addMessage, this.addNewMessage);

  return {
    getMessages: function () {
      return messages;
    }
  };

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
    this.listenTo(MessageStore, 'update', this.update);
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
  $$.render(MessagesList(), 'body');
});