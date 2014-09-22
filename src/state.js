var EventEmitter = require('./EventEmitter.js');
var utils = require('./utils.js');
/*
 *  State() takes a name and a constructor
 *  and creates a state object that can listen
 *  to actions and emit events themselves
 */
var state = function (constr) {
  var base = function () {
    this._exports = Object.create(EventEmitter.prototype);
    this.exports = {};
  };
  base.prototype = state.prototype;
  var newState = new base();
  constr.call(newState);
  return utils.merge(newState.exports, newState._exports);
};

/*
 *  Set EventEmitter as prototype so that components
 *  can listen to the state
 */
state.prototype = {

  /*
   * listenTo() binds the passed function to
   * the state object itself
   */
  listenTo: function (action, cb) {
    this._listeners = this._listeners || [];
    action.on('trigger', cb.bind(this));
  },
  flush: function () {
    this._exports.emit('update');
  },
  emit: function () {
    this._exports.emit.apply(this._exports, arguments);
  }
};

module.exports = state;
