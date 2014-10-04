var EventEmitter = require('./EventEmitter.js');
var utils = require('./utils.js');
var error = require('./error.js');
/*
 *  State() takes a name and a constructor
 *  and creates a state object that can listen
 *  to actions and emit events themselves
 */
var store = function (constr) {
  var exportsPrototype = Object.create(EventEmitter.prototype);
  var base = function () {};
  base.prototype = store.prototype;
  var newStore = new base();
  var exports = constr.call(newStore);
  if (!exports) {
    error.create({
      source: exports,
      message: 'Missing exported methods from store',
      support: 'Be sure to return an object with GETTER methods from your store',
      url: '' // TODO: Add store url
    })
  }
  newStore._exports = utils.mergeTo(exportsPrototype, exports);
  return newStore._exports;
};

/*
 *  Set EventEmitter as prototype so that components
 *  can listen to the state
 */
store.prototype = {

  /*
   * listenTo() binds the passed function to
   * the state object itself
   */
  listenTo: function (action, cb) {
    this._listeners = this._listeners || [];
    action.on('trigger', cb.bind(this));
  },
  emit: function () {
    this._exports.emit.apply(this._exports, arguments);
  }
};

module.exports = store;
