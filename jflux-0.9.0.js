!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define(["jquery"],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jflux=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/christianalfoni/Documents/dev/jflux/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],"/Users/christianalfoni/Documents/dev/jflux/src/EventEmitter.js":[function(require,module,exports){
/*!
 * EventEmitter v4.2.8 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

module.exports = (function () {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[key][i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    return EventEmitter;

}.call({}));
},{}],"/Users/christianalfoni/Documents/dev/jflux/src/action.js":[function(require,module,exports){
/*
 * ACTION
 * ====================================================================================
 * Creates a single function or a map of functions that when called with arguments will
 * emit a "trigger" event, passing the arguments
 * ====================================================================================
 */

var EventEmitter = require('./EventEmitter.js');
var error = require('./error.js');

var createActionFunction = function () {

  // Create the action function
  var fn = function () {

    // Grab all the arguments and convert to array
    var args = Array.prototype.slice.call(arguments, 0);

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

  return fn;

};

var action = function () {

  if (Array.isArray(arguments[0])) {
    var actionMap = {};
    arguments[0].forEach(function (actionName) {
      actionMap[actionName] = createActionFunction();
    });
    return actionMap;
  } else if (!arguments.length) {
    return createActionFunction();
  }

  error.create({
    source: arguments[0],
    message: 'Could not create action(s)',
    support: 'Pass no arguments or an array of strings',
    url: 'https://github.com/christianalfoni/jflux/blob/master/DOCUMENTATION.md#jflux-action'
  });

};

module.exports = action;
},{"./EventEmitter.js":"/Users/christianalfoni/Documents/dev/jflux/src/EventEmitter.js","./error.js":"/Users/christianalfoni/Documents/dev/jflux/src/error.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/component.js":[function(require,module,exports){
/*
 * COMPONENT
 * ====================================================================================
 * Composable components that only updates diffs etc.
 * ====================================================================================
 */

var dom = require('./dom.js');
var utils = require('./utils.js');
var createDomNodeRepresentation = require('./component/createDomNodeRepresentation.js');
var diff = require('./component/diff.js');
var compile = require('./component/compile.js');
var Constructor = require('./component/Constructor.js');
var error = require('./error.js');

var exports = {};

Constructor.prototype = {
  constructor: Constructor,

  // Runs when the component is added to the DOM by $$.render
  _init: function () {

    if (this.init) {
      this.init();
    }

    // Render the component and set it as the current render and the initial render
    this._renders = this._initialRenders = this.render(this._compiler.bind(this));

    if (!this._renders) {
      error.create({
        source: this._renders,
        message: 'Missing compiled DOM representation',
        support: 'You have to return a compile call from the render method',
        url: 'https://github.com/christianalfoni/jflux/blob/master/DOCUMENTATION.md#components-createacomponent'
      });
    }

    // Compile the renders, add bindings and listeners
    this.$el = compile(this._renders);

    this._addBindings();
    this._addListeners();

    this.$el.on('destroy', this._remove.bind(this));

    if (this.afterRender) {
      this.afterRender();
    }

    return this;

  },

  // Cleans up the listeners and removes the component from the DOM
  _remove: function () {

    this._listeners.forEach(function (listener) {
      listener.target.removeListener(listener.type, listener.cb);
    });

    if (this.teardown) {
      this.teardown();
    }

    return this;

  },

  // Runs the "render" method which compiles a DOM representation
  _render: function () {

    // To detect calling "this.listenTo" etc. in the render method
    this._isRendering = true;

    this._renders = this.render(this._compiler.bind(this));
    this._isRendering = false;
  },

  // Adds bindings to inputs, so that properties and the component itself
  // updates instantly
  _addBindings: function () {

    var component = this;
    Object.keys(this.bindings).forEach(function (binding) {


      var $el = binding ? component.$(binding) : component.$el;

      if ($el.is(':checkbox')) {

        $el.on('change', function () {
          var grabObject = utils.createGrabObject(component, component.bindings[binding]);
          grabObject.context[grabObject.prop] = $el.is(':checked');
          component.update();
        });

      } else {

        $el.on('keydown', function (event) {

          // Do not update on ENTER due to form submit
          if (event.keyCode !== 13) {

            // Use setTimeout to grab the value after keydown has run.
            // Gives the best experience
            setTimeout(function () {
              var grabObject = utils.createGrabObject(component, component.bindings[binding]);
              grabObject.context[grabObject.prop] = $el.val();
              component.update();
            }, 0);

          }

        });

      }

    });
  },

  // Adds interaction listeners, like "click" etc.
  _addListeners: function () {
    var component = this;
    Object.keys(this.events).forEach(function (listenerDefinition) {

      var listener = utils.extractTypeAndTarget(listenerDefinition);

      if (!component[component.events[listenerDefinition]]) {
        error.create({
          source: component[component.events[listenerDefinition]],
          message: 'There is no method called ' + component.events[listenerDefinition],
          support: 'Make sure that you add methods described in events on your component',
          url: '' // TODO: Add url
        })
      }

      if (listener.target) {
        component.$el.on(listener.type, listener.target, function (event) {

          var $target = dom.$(event.currentTarget);
          event.data = $target.data('data');
          component[component.events[listenerDefinition]](event);

        });
      } else {

        component.$el.on(listener.type, function (event) {

          event.data = component.$el.data('data');
          component[component.events[listenerDefinition]](event);

        });
      }

    });
  },

  /*
   * This function is passed to "render" and "map". It iterates over the arguments
   * passed to the compiler. It jumps in and out of levels based on the
   * domNodeRepresentation object and creates a nested array structure. It uses a
   * traverseArray to achieve this:
   * <div>
   *   <div>
   *   </div>
   * </div>
   *
   * 1. "initLevel" created, set as "currentLevel" and put first in the "traverseArray"
   * 2. <div> is found an pushed into "currentLevel"
   * 3. Children is found and a new level is pushed to "currentLevel" and the "traverseArray"
   * 4. Next <div> is found an pushed to currentLevel
   * 5. No children found
   * 6. </div> causes a pop() in "traverseArray" and we are back at our previous level
   * 7. </div> causes a new pop() in "traverseArray" and we are done
   * 8. [<div/>, [<div/>]] is the result
   */
  _compiler: function () {

    var compilerArgs = Array.prototype.slice.call(arguments, 0);
    var initLevel = [];
    var currentLevel = initLevel;
    var traverseArray = [initLevel];

    for (var x = 0; x < compilerArgs.length; x++) {

      var compilerArg = compilerArgs[x];
      var domNodeRepresentation = createDomNodeRepresentation(compilerArg, this);

      // If it is an array, jQuery object or Component
      if (typeof compilerArg === 'object') {
        currentLevel.push(domNodeRepresentation);
      } else if (domNodeRepresentation.node) {
        currentLevel.push(domNodeRepresentation.node);
      } else {
        traverseArray.pop();
        currentLevel = traverseArray[traverseArray.length - 1];
        continue;
      }

      if (domNodeRepresentation.hasChildren) {
        var newLevel = [];
        newLevel.isChildArray = true;
        currentLevel.push(newLevel);
        currentLevel = newLevel;
        traverseArray.push(newLevel);
      }

    }

    // If we are compiling a mapped item, take the index
    // along in case no ID is set
    if (typeof this.index === 'number') {
      if (initLevel[0] instanceof dom.$ && !initLevel[0].attr('id')) {
        initLevel[0]._jfluxIndex = this.index;
      } else if (initLevel[0] instanceof Constructor && !initLevel[0].props.id) {
        initLevel[0]._jfluxIndex = this.index;
      }
    }

    return initLevel;
  },
  _diff: diff,
  $: function (query) {
    return this.$el.find(query);
  },
  update: function () {
    this._render();
    this._diff(this._renders, this._initialRenders);
  },
  render: function (compile) {
    return compile(
      '<div></div>'
    );
  },
  listenTo: function (target, type, cb) {

    if (this._isRendering) {
      error.create({
        source: null,
        message: 'You are running listenTo in your render',
        support: 'The listenTo method is to be run in the init method',
        url: ''
      });
    }

    cb = cb.bind(this);
    this._listeners.push({
      target: target,
      type: type,
      cb: cb
    });

    target.on(type, cb);

  },

  // Do a mapping and bind the item in the list to the context of the callback and compiler,
  // making it possible to use $$-attributes and this.someProp
  map: function (array, cb) {
    var component = this;
    return array.map(function (item, index) {
      var context = {
        item: item,
        props: component.props,
        index: index
      };
      return cb.call(context, component._compiler.bind(context));
    });
  }
};

module.exports = function (description) {
  return function (props) {
    var base = new Constructor(props);
    var component = utils.mergeTo(base, description);
    component._description = description;
    return component;
  }
};
},{"./component/Constructor.js":"/Users/christianalfoni/Documents/dev/jflux/src/component/Constructor.js","./component/compile.js":"/Users/christianalfoni/Documents/dev/jflux/src/component/compile.js","./component/createDomNodeRepresentation.js":"/Users/christianalfoni/Documents/dev/jflux/src/component/createDomNodeRepresentation.js","./component/diff.js":"/Users/christianalfoni/Documents/dev/jflux/src/component/diff.js","./dom.js":"/Users/christianalfoni/Documents/dev/jflux/src/dom.js","./error.js":"/Users/christianalfoni/Documents/dev/jflux/src/error.js","./utils.js":"/Users/christianalfoni/Documents/dev/jflux/src/utils.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/component/Constructor.js":[function(require,module,exports){
function Component (props) {

  this.events = {};
  this.bindings = {};
  this._initialRenders = [];
  this._isRendering = false;
  this._bindings = [];
  this._renders = [];
  this._listeners = [];
  this.props = props || {};
}

module.exports = Component;
},{}],"/Users/christianalfoni/Documents/dev/jflux/src/component/compile.js":[function(require,module,exports){
// Compiles DOM representations to a jQuery object. "registerComponents" is used
// by "_init" to register nested components for later removal
var dom = require('./../dom.js');
var utils = require('./../utils.js');
var Constructor = require('./Constructor.js');

var compile = function (renders) {

  var topNode = dom.$();

  renders.forEach(function (render) {


    // If the render is an array of children, append them
    // to the last child of the topNode
    if (Array.isArray(render) && render.isChildArray) {

      topNode.last().append(compile(render));

      // If the render is a normal array, meaning it is an array of compiled
      // objects (Like using this.map to create a list in the component). Flatten
      // the array, compile it and append to the top node
    } else if (Array.isArray(render)) {

      topNode = topNode.add(compile(utils.flatten(render)));

      // If the render is a component, initialize it and append. If
      // this is during initializing add the component to a lookup list
    } else if (render instanceof Constructor) {

      topNode = topNode.add(render._init().$el);

      // If it is just a jQuery object, append it
    } else {

      topNode = topNode.add(render);
    }

  });

  return topNode;
};

module.exports = compile;
},{"./../dom.js":"/Users/christianalfoni/Documents/dev/jflux/src/dom.js","./../utils.js":"/Users/christianalfoni/Documents/dev/jflux/src/utils.js","./Constructor.js":"/Users/christianalfoni/Documents/dev/jflux/src/component/Constructor.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/component/convertAttributes.js":[function(require,module,exports){
/*
 * CONVERTATTRIBUTES
 * ====================================================================================
 * Converts jFlux attributes to HTML attributes, and them removes the jFlux version.
 * The jFlux attribute is a property on a context. The value fetched is then use
 * to set the correct HTML attribute
 * ====================================================================================
 */
var dom = require('./../dom.js');
var utils = require('./../utils.js');

var converters = {
  '$$-id': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-id'));
    $el.attr('id', value);
  },
  '$$-class': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-class'));
    var classString = utils.createClassString(value);
    if (classString) $el.attr('class', classString);
  },
  '$$-style': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-style'));
    var styleString = utils.createStyleString(value);
    if (styleString) $el.attr('style', styleString);
  },
  '$$-checked': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-checked'));
    $el.attr('checked', value);
  },
  '$$-disabled': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-disabled'));
    $el.attr('disabled', value);
  },
  '$$-value': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-value'));
    $el.val(value);
  },
  '$$-href': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-href'));
    $el.attr('href', value);
  },
  '$$-show': function ($el, context) {
    var show = utils.grabContextValue(context, $el.attr('$$-show'));
    if (show) {
      $el.show();
    } else {
      $el.hide();
    }
  },
  '$$-data': function ($el, context) {
    $el.data('data', utils.grabContextValue(context, $el.attr('$$-data')));
  }
};

var convertAttributes = function ($el, context) {

  Object.keys(converters).forEach(function (attr) {
    if ($el.attr(attr)) {
      converters[attr]($el, context);
      $el.removeAttr(attr);
    }
  });

  return $el;

};

module.exports = convertAttributes;
},{"./../dom.js":"/Users/christianalfoni/Documents/dev/jflux/src/dom.js","./../utils.js":"/Users/christianalfoni/Documents/dev/jflux/src/utils.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/component/createDomNodeRepresentation.js":[function(require,module,exports){
/*
 * CREATEDOMNODEREPRESENTATION
 * ====================================================================================
 * Analyses the arguments passed to "compile" and returns a representation
 * ====================================================================================
 */
var dom = require('./../dom.js');
var convertAttributes = require('./convertAttributes.js');

var matchers = {
  short:  /<.*\/>/,
  long: /<.*>[\s\S]*<\/.*>/, // [\s\S] matches linebreaks too
  closing: /<\/.*>/,
  opening: /<.*>/
};

var createDomNodeRepresentation = function (arg, context) {

  // If it is an array, jQuery object or Component
  if (typeof arg === 'object') {
    return arg;
  }

  arg += ''; // Convert to string

  // E.g. "<div/>" or "<div></div>"
  if (arg.match(matchers.short) || arg.match(matchers.long)) {

    return {
      hasChildren: false,
      node: convertAttributes(dom.$(arg), context)
    };

    // E.g. "</div>"
  } else if (arg.match(matchers.closing)) {

    return {
      hasChildren: false,
      node: null
    }

    // E.g. "<div>"
  } else if (arg.match(matchers.opening)) {

    return {
      hasChildren: true,
      node: convertAttributes(dom.$(arg), context)
    }

    // E.g. "hello world"
  } else if (typeof arg === 'string') {

    return {
      hasChildren: false,
      node: dom.$(dom.document.createTextNode(arg))
    }

  }
};

module.exports = createDomNodeRepresentation;
},{"./../dom.js":"/Users/christianalfoni/Documents/dev/jflux/src/dom.js","./convertAttributes.js":"/Users/christianalfoni/Documents/dev/jflux/src/component/convertAttributes.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/component/diff.js":[function(require,module,exports){
var dom = require('./../dom.js');
var Constructor = require('./Constructor.js');
var addToList = require('./diff/addToList.js');
var removeFromList = require('./diff/removeFromList.js');
var diffAttributes = require('./diff/diffAttributes.js');
var utils = require('./../utils.js');

var diff = function (renders, initialRenders, node) {

  renders.forEach(function (renders, index) {

    // If it is an array of children, diff that array
    if (Array.isArray(renders) && renders.isChildArray) {

      diff(renders, initialRenders[index], initialRenders[index - 1]);

      // If it is a normal array (list of DOM representations)
    } else if (Array.isArray(renders)) {

      if (renders.length > initialRenders[index].length) {
        addToList(renders, initialRenders[index], node);
      } else if (renders.length < initialRenders[index].length) {
        removeFromList(renders, initialRenders[index]);
      }

      diff(renders, initialRenders[index]);

      // If it is a component
    } else if (renders instanceof Constructor) {

      // Grab properties
      var oldProps = initialRenders[index].props;
      var newProps = renders.props;

      var propsChanged = !utils.deepCompare(oldProps, newProps); // TODO: Create hash instead
      if (propsChanged) {
        initialRenders[index].props = newProps;
        initialRenders[index].update();
      }

      // If it is a text node
    } else if (renders.get(0).nodeType === 3 && renders.text() !== initialRenders[index].text()) {

      initialRenders[index].get(0).nodeValue = renders.text();

    } else if (renders instanceof dom.$) {
      diffAttributes(renders, initialRenders[index]);
    }

  });

};

module.exports = diff;
},{"./../dom.js":"/Users/christianalfoni/Documents/dev/jflux/src/dom.js","./../utils.js":"/Users/christianalfoni/Documents/dev/jflux/src/utils.js","./Constructor.js":"/Users/christianalfoni/Documents/dev/jflux/src/component/Constructor.js","./diff/addToList.js":"/Users/christianalfoni/Documents/dev/jflux/src/component/diff/addToList.js","./diff/diffAttributes.js":"/Users/christianalfoni/Documents/dev/jflux/src/component/diff/diffAttributes.js","./diff/removeFromList.js":"/Users/christianalfoni/Documents/dev/jflux/src/component/diff/removeFromList.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/component/diff/addToList.js":[function(require,module,exports){
var Constructor = require('./../Constructor.js');
var compile = require('./../compile.js');

var addToList = function (renders, initialRenders, node) {

  // Collect IDs to compare them and figure out what items in list
  // already exists
  var rendersIds = renders.map(function (render) {
    return render[0] instanceof Constructor ? render[0].props.id || render[0]._jfluxIndex : render[0].attr('id') || render[0]._jfluxIndex;
  });
  var initialRendersIds = initialRenders.map(function (initialRender) {
    return initialRender[0] instanceof Constructor ? initialRender[0].props.id || initialRender[0]._jfluxIndex : initialRender[0].attr('id') || initialRender[0]._jfluxIndex;
  });

  // Iterate over list of new IDs and check if it exists in
  // the initial render
  rendersIds.forEach(function (id, index) {

    // If at end of or past list length, push it to the list
    if (initialRendersIds.indexOf(id) === -1 && index >= initialRenders.length) {

      // Append to current top node
      node.append(compile(renders[index]));

      // Push it into initial renders list for later handling
      initialRenders.push(renders[index]);

      // If current new ID is not part of initial render and we are not at end of list,
      // squeeze it into place
    } else if (initialRendersIds.indexOf(id) === -1) {

      compile(renders[index]).insertBefore(initialRenders[index][0]);
      initialRenders.splice(index, 0, renders[index]);

    }
  });
}

module.exports = addToList;
},{"./../Constructor.js":"/Users/christianalfoni/Documents/dev/jflux/src/component/Constructor.js","./../compile.js":"/Users/christianalfoni/Documents/dev/jflux/src/component/compile.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/component/diff/diffAttributes.js":[function(require,module,exports){
var dom = require('../../dom.js');

var attributes = [
  'style',
  'className',
  'disabled',
  'checked',
  'id',
  'value'
];

var diffAttributes = function (renders, initialRenders) {

  var currentEl = initialRenders.get(0);
  var newEl = renders.get(0);

  attributes.forEach(function (attribute) {
    if (!currentEl[attribute] && !newEl[attribute]) {
      return;
    }
    if (attribute === 'style' && initialRenders.attr('style') !== renders.attr('style')) {
      return initialRenders.attr('style', renders.attr('style'));
    } else if (attribute !== 'style' && currentEl[attribute] !== newEl[attribute]) {
      return currentEl[attribute] = newEl[attribute];
    }
  });

};

module.exports = diffAttributes;
},{"../../dom.js":"/Users/christianalfoni/Documents/dev/jflux/src/dom.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/component/diff/removeFromList.js":[function(require,module,exports){
var Constructor = require('./../Constructor.js');

var removeFromList = function (renders, initialRenders) {

  var rendersIds = renders.map(function (render) {
    return render[0] instanceof Constructor ? render[0].props.id || render[0]._jfluxIndex : render[0].attr('id') || render[0]._jfluxIndex;
  });

  var initialRendersIds = initialRenders.map(function (initialRender) {
    return initialRender[0] instanceof Constructor ? initialRender[0].props.id || initialRender[0]._jfluxIndex : initialRender[0].attr('id') || initialRender[0]._jfluxIndex;
  });

  // Go through list backwards and remove item
  for (var x = initialRendersIds.length - 1; x >= 0; x--) {
    var id = initialRendersIds[x];
    if (rendersIds.indexOf(id) === -1) {

      initialRenders[x][0] instanceof Constructor ? initialRenders[x][0].$el.remove() : initialRenders[x][0].remove();
      initialRenders.splice(x, 1);

    }
  }

};

module.exports = removeFromList;
},{"./../Constructor.js":"/Users/christianalfoni/Documents/dev/jflux/src/component/Constructor.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/config.js":[function(require,module,exports){
/*
 * CONFIG
 * ====================================================================================
 * Holds default config
 * ====================================================================================
 */
var utils = require('./utils.js');
var _options = {

    // jFlux will add application/json to request headers and parse
    // responses to JSON
    json: true,

    // If the application lives at /somePath, jFlux needs to know about it
    baseUrl: '',

    // Activates HTML5 pushState instead of HASH
    pushState: false,

    // Tells jFlux to run the $$.run method automatically, which routes to
    // current path
    autoRun: true

};

var config = function (options) {
    if (!options) {
        return _options;
    } else {
        utils.mergeTo(_options, options);
    }
};

module.exports = config;
},{"./utils.js":"/Users/christianalfoni/Documents/dev/jflux/src/utils.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/dom.js":[function(require,module,exports){
(function (global){
module.exports = {
  $: function () {

    if (global.jQuery) {
      this.$ = global.jQuery;
      return this.$.apply(this.$, arguments);
    } else if (typeof window !== 'undefined') {
      this.$ = require('jquery');
      return this.$.apply(this.$, arguments);
    }

  },
  document: global.document,
  setWindow: function (window) {
    this.$ = require('jquery')(window);
    this.document = window.document;
  }
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"jquery":"jquery"}],"/Users/christianalfoni/Documents/dev/jflux/src/error.js":[function(require,module,exports){
module.exports = {
  create: function (options) {
    var errorString = 'jFlux error: ';
    var keys = Object.keys(options);
    if (keys.indexOf('source') >= 0) {
      errorString += (typeof options.source === 'object' && options.source !== null ? JSON.stringify(options.source) : options.source) + '. ';
    }
    if (keys.indexOf('message') >= 0) {
      errorString += options.message + '. ';
    }
    if (keys.indexOf('support') >= 0) {
      errorString += options.support + '. ';
    }
    if (keys.indexOf('url') >= 0) {
      errorString += 'More documentation at: ' + options.url + '.';
    }
    throw new Error(errorString);
  }
};
},{}],"/Users/christianalfoni/Documents/dev/jflux/src/jflux.js":[function(require,module,exports){
(function (global){
var dom = require('./dom.js');
var render = require('./jflux/render.js');
var config = require('./config.js');
var path = require('./jflux/path.js');
var component = require('./component.js');
var router = require('./router.js');
var run = require('./jflux/run.js');
var action = require('./action.js');
var store = require('./store.js');
var test = require('./test.js');
var utils = require('./utils.js');

var exports = {
    run: run,
    render: render,
    config: config,
    path: path,
    component: component,
    route: router.route,
    action: action,
    store: store,
    test: test,
    immutable: utils.deepClone,
    fakeState: function (exports) {
      return this.state(function () {
        this.exports = exports;
      });
    }
};

// If not running in Node
if (typeof window !== 'undefined') {

  dom.$(function () {
    if (!global.define && config().autoRun) {
      exports.run();
    }
    if (config().json) {
      dom.$.ajaxSetup({
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        beforeSend: function (jXhr, options) {

          if (

            options.contentType === 'application/json' &&
          // If it is POST, PUT or DELETE.
          // GET converts data properties to a query
            options.type !== 'GET' &&

            // If you are passing data
            options.data &&

            // If it is not already a string
            typeof options.data !== 'string'
            ) {

            // Stringify the data to JSON
            options.data = JSON.stringify(options.data);
          }

        }
      });
    }
  });

}

// If running in global mode, expose $$
if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.$$ = exports;
}


module.exports = exports;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./action.js":"/Users/christianalfoni/Documents/dev/jflux/src/action.js","./component.js":"/Users/christianalfoni/Documents/dev/jflux/src/component.js","./config.js":"/Users/christianalfoni/Documents/dev/jflux/src/config.js","./dom.js":"/Users/christianalfoni/Documents/dev/jflux/src/dom.js","./jflux/path.js":"/Users/christianalfoni/Documents/dev/jflux/src/jflux/path.js","./jflux/render.js":"/Users/christianalfoni/Documents/dev/jflux/src/jflux/render.js","./jflux/run.js":"/Users/christianalfoni/Documents/dev/jflux/src/jflux/run.js","./router.js":"/Users/christianalfoni/Documents/dev/jflux/src/router.js","./store.js":"/Users/christianalfoni/Documents/dev/jflux/src/store.js","./test.js":"/Users/christianalfoni/Documents/dev/jflux/src/test.js","./utils.js":"/Users/christianalfoni/Documents/dev/jflux/src/utils.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/jflux/path.js":[function(require,module,exports){
/*
 * PATH
 * ====================================================================================
 * Returns the current route path
 * ====================================================================================
 */
var config = require('./../config.js');
var path = function () {

  return config().pushState ?

    // Return the pathname without baseUrl
    location.pathname.substr(config().baseUrl.length) :

    // Return the hash, without the #
    location.hash.substr(1);

};

module.exports = path;
},{"./../config.js":"/Users/christianalfoni/Documents/dev/jflux/src/config.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/jflux/render.js":[function(require,module,exports){
/*
 * RENDER
 * ====================================================================================
 * Initializes and appends a component to the DOM. It does a lookup to check if
 * there already is a component where it will either update by replacing the properties
 * or remove the old one and append the new one. If no components registered the
 * new component will be appended
 * ====================================================================================
 */

var dom = require('./../dom.js');
var utils = require('./../utils.js');

// Components rendered to the DOM will be stored in this array, as a lookup
var _renderedComponents = [];

// Add a special event that will run the handler when removed
// It is used to remove component when main element is removed from DOM
dom.$(function () {
  if (dom.$.event.special) {
    dom.$.event.special.destroy = {
      remove: function (data) {
        var component = data.handler();
        var existingRender = utils.getFromListByProp(_renderedComponents, 'component', component);
        if (existingRender) {
          _renderedComponents.splice(_renderedComponents.indexOf(existingRender), 1);
        }
      }
    };
  }
});

var render = function (component, target) {

  var existingRender = utils.getFromListByProp(_renderedComponents, 'target', target);

  // If there is an existing component of same type and the props has changed,
  // update existing component
  if (existingRender &&
    existingRender.component._description === component._description
      && !utils.deepCompare(existingRender.component.props, component.props)) {

    existingRender.component.props = component.props;
    existingRender.component.update();

    // If no existing component or the component type has changed,
    // initialize a new component
  } else if (!existingRender || existingRender.component._description !== component._description) {

    component._init();
    dom.$(target).html(component.$el);

    _renderedComponents.push({
      component: component,
      target: target
    });

  }
};

module.exports = render;
},{"./../dom.js":"/Users/christianalfoni/Documents/dev/jflux/src/dom.js","./../utils.js":"/Users/christianalfoni/Documents/dev/jflux/src/utils.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/jflux/run.js":[function(require,module,exports){
/*
 * RUN
 * ====================================================================================
 * Registers hyperlink handling and triggers the router. This runs automatically
 * on page load, unless using requirejs or "autoRun" in the config is set to false
 * ====================================================================================
 */

var dom = require('./../dom.js');
var router = require('./../router.js');
var config = require('./../config.js');

var run = function () {

  // Any links triggered, intercept and use router instead, passing
  // the path
  dom.$('body').on('click', 'a', function (event) {

    // Only grab it if there is no target attribute
    if (!event.currentTarget.getAttribute('target')) {
      event.preventDefault();

      // We have to turn off the onhashchange trigger to avoid triggering the route
      // again, and at the same time allow for back/forward buttons
      var hashchange = window.onhashchange;
      window.onhashchange = null;

      // href is full url, so to get the path we need to remove the origin and any
      // baseUrl
      var path = event.currentTarget.href.substr(location.origin.length);
      router.goTo(path);

      // Put hash listening back into the event loop
      setTimeout(function () {
        window.onhashchange = hashchange;
      }, 0);
    }
  });

  if (config().pushState) {
    window.onpopstate = function () {
      router.goTo(location.pathname.substr(config().baseUrl.length));
    };
  } else {
    window.onhashchange = function () {
      router.goTo(location.hash.substr(1));
    };
  }

  // Initial routing passing current pathname without baseUrl
  var path = location.pathname.substr(config().baseUrl.length);
  router.goTo(path);

};

module.exports = run;
},{"./../config.js":"/Users/christianalfoni/Documents/dev/jflux/src/config.js","./../dom.js":"/Users/christianalfoni/Documents/dev/jflux/src/dom.js","./../router.js":"/Users/christianalfoni/Documents/dev/jflux/src/router.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/router.js":[function(require,module,exports){
/*
 * ROUTER
 * ====================================================================================
 * Registers new routes and handles route changes
 * ====================================================================================
 */

var dom = require('./dom.js');
var utils = require('./utils.js');
var config = require('./config.js');

var exports = {};

var routes = [];

var initialRouting = true;
var previousPath = '';

exports.triggerRoute = function (route, compiledRoute, params) {
  if (typeof route.callback === 'string') {
    exports.resolveRoute(route.callback);
  } else if (config().pushState) {

    if (!initialRouting && route.path === previousPath) {
      window.history.replaceState({}, '', config().baseUrl + compiledRoute);
    } else {
      window.history.pushState({}, '', config().baseUrl + compiledRoute);
      route.callback(params);
      initialRouting = false;
    }
  } else {
    location.href = config().baseUrl + '/#' + compiledRoute;
    route.callback(params);
  }
  previousPath = route.path;
};

exports.resolveRoute = function (path) {
  for (var x = 0; x < routes.length; x++) {
    var route = routes[x];
    if (utils.matchRoute(path, route.path, utils.isParam)) {
      var params = utils.getParams(path, route.path, utils.isParam);
      return exports.triggerRoute(route, utils.compileRoute(route.path, params), params);
    }
  }
  if (routes.length) {
    throw new Error('No routes match ' + path);
  }
};

exports.route = function (path, callback) {
  if (arguments.length === 1) {
    exports.goTo(path);
  } else {
    routes.push({
      path: path,
      callback: callback
    });
  }
};

exports.goTo = function (path) {
  dom.$(function () {
    exports.resolveRoute(path);
  });
};

exports.deferTo = function (path) {
  return function () {
    exports.goTo(path);
  };
};

module.exports = exports;
},{"./config.js":"/Users/christianalfoni/Documents/dev/jflux/src/config.js","./dom.js":"/Users/christianalfoni/Documents/dev/jflux/src/dom.js","./utils.js":"/Users/christianalfoni/Documents/dev/jflux/src/utils.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/store.js":[function(require,module,exports){
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

},{"./EventEmitter.js":"/Users/christianalfoni/Documents/dev/jflux/src/EventEmitter.js","./error.js":"/Users/christianalfoni/Documents/dev/jflux/src/error.js","./utils.js":"/Users/christianalfoni/Documents/dev/jflux/src/utils.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/test.js":[function(require,module,exports){
(function (process){
var dom = require('./dom.js');

module.exports = function (file, stubs, test) {

  // Trick browserify/webpack to not notice these deps as they are only used in Node
  var req = require;
  var proxyquire = req('proxyquire').noPreserveCache();
  var env = req('jsdom').env;
  var html = '<html><body></body></html>';
  var getModule = function () {
    if (stubs) {
      return proxyquire(file, stubs);
    } else {
      return require(file);
    }
  };

  // Just running a test, not loading a module at all
  if (arguments.length === 1 && typeof file === 'function') {
    test = file;
  } else {

    if (arguments.length === 2) {
      test = stubs;
      stubs = null;
    }

    file = process.cwd() + '/' + file;

    var module = getModule(file, stubs);
  }

  // If test has no module or dependency overrides, set up
  // an environment and run the test. Used for internal testing
  if (arguments.length === 1) {
    env(html, function (errors, window) {
      dom.setWindow(window);
      try {
        test(dom.$);
      } catch (e) {
        console.log(e);
      }
      window.close();
    });
  } else if (arguments.length > 1 && test.length < 2) {
    test(module);
  } else {
    env(html, function (errors, window) {
      dom.setWindow(window);
      try {
        test(module, dom.$);
      } catch (e) {
        console.log(e);
      }
      window.close();
    });
  }

};
}).call(this,require('_process'))
},{"./dom.js":"/Users/christianalfoni/Documents/dev/jflux/src/dom.js","_process":"/Users/christianalfoni/Documents/dev/jflux/node_modules/browserify/node_modules/process/browser.js"}],"/Users/christianalfoni/Documents/dev/jflux/src/utils.js":[function(require,module,exports){
var dom = require('./dom.js');

var exports = {};

exports.deepClone = function (object) {

  if (Array.isArray(object)) {
    return object.map(function (item) {
      return exports.deepClone(item);
    });
  } else if (exports.isObject(object)) {
    return dom.$.extend(true, {}, object);
  } else {
    return object;
  }

};

exports.isParam = function (part) {
  var match = part.match(/^\{.*\}$/);
  return match && match.length ? true : false;
};

exports.removeFromListByProp = function (list, prop, item) {
  for (var x = 0; x < list.length; x++) {
    if (list[x][prop] === item) {
      list.splice(x, 1);
      return;
    }
  }
};

exports.flatten = function (array) {
  return array.reduce(function (returnArray, value) {
    returnArray = returnArray.concat(value);
    return returnArray;
  }, []);
};

exports.getFromListByProp = function (list, prop, item) {
  for (var x = 0; x < list.length; x++) {
    if (list[x][prop] === item) {
      return list[x];
    }
  }
};

exports.removeEmptyInArray = function (array) {
  for (var x = array.length - 1; x >= 0; x--) {
    if (!array[x] && typeof array[x] !== 'number') {
      array.splice(x, 1);
    }
  }
  return array;
};

exports.matchRoute = function (path, route, identifier) {
  if (route === '*') {
    return true;
  }
  var pathArray = path.split('/');
  var routeArray = route.split('/');
  this.removeEmptyInArray(pathArray);
  this.removeEmptyInArray(routeArray);
  if (pathArray.length !== routeArray.length) {
    return false;
  }
  for (var x = 0; x < pathArray.length; x++) {
    if (pathArray[x] !== routeArray[x] && !identifier(routeArray[x])) {
      return false;
    }
  }
  return true;
};

exports.getParams = function (path, route, identifier) {
  var params = {};
  var pathArray = path.split('/');
  var routeArray = route.split('/');
  routeArray.forEach(function (routePart, index) {
    if (identifier(routePart)) {
      params[routePart.replace(/\{|\}/g, '')] = pathArray[index];
    }
  });
  return params;
};

exports.compileRoute = function (path, params) {
  for (var prop in params) {
    if (params.hasOwnProperty(prop)) {
      path = path.replace('{' + prop + '}', params[prop]);
    }
  }
  return path;
};

exports.mergeTo = function (target) {
  var sources = Array.prototype.splice.call(arguments, 1, arguments.length - 1);
  sources.forEach(function (source) {
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        target[prop] = source[prop];
      }
    }
  });
  return target;
};

exports.isObject = function (obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
};

exports.deepCompare = function (a, b) {

  var compare = function (valueA, valueB) {
    if (Array.isArray(valueA) || exports.isObject(valueA)) {
      var isTheSame = exports.deepCompare(valueA, valueB);
      if (!isTheSame) {
        return false;
      }
    } else if (valueA !== valueB) {
      return false;
    }
    return true;
  };

  if (Array.isArray(a) && Array.isArray(b) && a !== b) {

    for (var x = 0; x < a.length; x++) {
      var isSame = compare(a[x], b[x]);
      if (!isSame) {
        return false;
      }
    }
    ;
    return true;

  } else if (exports.isObject(a) && exports.isObject(a) && a !== b) {

    for (var prop in a) {
      if (a.hasOwnProperty(prop)) {
        var isSame = compare(a[prop], b[prop]);
        if (!isSame) {
          return false;
        }
      }
    }

    return true;

  } else {
    return false;
  }
};

exports.grabContextValue = function (context, grabber) {
  var value = context;
  var grabs = grabber.split('.');
  grabs.forEach(function (grab) {
    value = value[grab];
  });
  return value;
};

exports.createGrabObject = function (context, grabString) {
  var grabs = grabString.split('.');
  var prop = grabs.pop();
  grabs.forEach(function (grab) {
    context = context[grab];
  });
  return {
    prop: prop,
    context: context
  }
};

exports.createClassString = function (obj) {
  var classes = [];
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop) && obj[prop]) {
      classes.push(prop);
    }
  }
  return classes.join(' ');
};

exports.createStyleString = function (obj) {
  var classes = [];
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop) && obj[prop]) {
      classes.push(prop + ':' + obj[prop]);
    }
  }
  return classes.join(';');
};

exports.extractTypeAndTarget = function (event) {
  var eventArray = event.split(' ');
  return {
    type: eventArray[0],
    target: eventArray[1]
  };
};

module.exports = exports;
},{"./dom.js":"/Users/christianalfoni/Documents/dev/jflux/src/dom.js"}]},{},["/Users/christianalfoni/Documents/dev/jflux/src/jflux.js"])("/Users/christianalfoni/Documents/dev/jflux/src/jflux.js")
});