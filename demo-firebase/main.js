/*
 * ACTIONS
 */
var actions = $$.action(['addMessage']);

/*
 * STATE
 */
var MessagesState = $$.state(function (flush) {

  var messages = [];
  
  // Connecting to Firebase
  var db = new Firebase('https://klsyfflspoi.firebaseio-demo.com/messages');

  // Creating a view to only show last 10 messages
  var view = db.limit(10);
  
  this.addNewMessage = function (message) {
    db.push(message);
  };

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
      return a.date < b.date;
    });
    flush();
  });

  this.listenTo(actions.addMessage, this.addNewMessage);
  this.exports({
    getMessages: function () {
      return messages;
    }
  });

});

/*
 * COMPONENT
 */
var MessagesList = $$.component(function (template) {

  this.addMessage = function (form, event) {
    event.preventDefault();
    var text = this.$('input').val().trim();
    if (text) {
      actions.addMessage({
        date: Date.now(),
        text: text
      });
    }
    this.$('input').val('');
  };

  this.listenTo(MessagesState, this.update);
  this.listenTo('submit', 'form', this.addMessage);
  
  this.render(function () {
    var messages = MessagesState.getMessages().map(function (message) {
       return template(
        '<li id="' + message.id + '">',
          message.text,
        '</li>'
      ); 
    });
    return template(
      '<div>',
        '<form>',
          '<input/>',
        '</form>',
        '<ul>',
          messages,
        '</ul>',
      '</div>'
    );
  });

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