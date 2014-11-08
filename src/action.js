/*
 * ACTION
 * ====================================================================================
 * Creates a single function or a map of functions that when called with arguments will
 * emit a "trigger" event, passing the arguments
 * ====================================================================================
 */

var EventEmitter = require('./EventEmitter.js');
var error = require('./error.js');
var utils = require('./utils.js');

var createActionFunction = function (actionName) {

  // Create the action function
  var fn = function () {

    // Grab all the arguments and convert to array
    var args = utils.deepClone(Array.prototype.slice.call(arguments, 0));

    if (!fn._events) {
      return error.create({
        source: fn.handlerName,
        message: 'You are triggering an action that nobody listens to',
        support: 'Remember to add actions to your stores',
        url: 'https://github.com/christianalfoni/jflux/blob/master/DOCUMENTATION.md#jflux-store'
      });
    }
    // Merge arguments array with "trigger", which is the
    // event that will be triggered, passing the original arguments
    // as arguments to the "trigger" event
    args = ['trigger'].concat(args);
    fn.emit.apply(fn, args);

  };

  // It is possible to listen to the function and to achieve that we
  // have to manually inherit methods from EventEmitter
  for (var prop in EventEmitter.prototype) {
    if (EventEmitter.prototype.hasOwnProperty(prop)) {
      fn[prop] = EventEmitter.prototype[prop];
    }
  }

  // Add handlerName
  fn.handlerName = actionName;

  return fn;

};

var action = function () {

  if (Array.isArray(arguments[0])) {
    var actionMap = {};
    arguments[0].forEach(function (actionName) {
      actionMap[actionName] = createActionFunction(actionName);
    });
    return actionMap;
  }

  error.create({
    source: arguments[0],
    message: 'Could not create action(s)',
    support: 'Pass no arguments or an array of strings',
    url: 'https://github.com/christianalfoni/jflux/blob/master/DOCUMENTATION.md#jflux-action'
  });

};

module.exports = action;