(function(name, altName, definition) { 
  if (typeof module != "undefined") module.exports = definition(window.jquery || require("jquery"));
  else if (typeof define == "function" && typeof define.amd == "object") define(["jquery"], definition);
  else this[name] = this[altName] = definition(jQuery);
}("jframework", "$$", function($) {
  "use strict"
  var DEBUG = true;
  /*!
   * EventEmitter v4.2.8 - git.io/ee
   * Oliver Caldwell
   * MIT license
   * @preserve
   */

  var EventEmitter = (function () {
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
var utils = (function () {

  var exports = {};


  var isParam = function (part) {
    return part.match(/\{.*\}/);
  }

  exports.removeEmptyInArray = function (array) {
    for (var x = array.length - 1; x >= 0; x--) {
      if (!array[x] && typeof array[x] !== 'number') {
        array.splice(x, 1);
      }
    }
    return array;
  };

  exports.matchRoute = function (path, route) {
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
      if (pathArray[x] !== routeArray[x] && !isParam(routeArray[x])) {
        return false;
      }
    } 
    return true;
  };

  exports.getParams = function (path, route) {
    var params = {};
    var pathArray = path.split('/');
    var routeArray = route.split('/');
    routeArray.forEach(function (routePart, index) {
      if (isParam(routePart)) {
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

  exports.merge = function (source, target) {
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        target[prop] = source[prop];
      }
    }
    return target;
  };

  exports.isObject = function (obj) {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
  };

  exports.deepCompare = function (a, b) {

    var compare = function (valueA, valueB) {
      if (Array.isArray(valueA) || exports.isObject(valueA))  {
        var isTheSame = exports.deepComparison(valueA, valueB);
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
      };
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

  exports.createClassString = function (obj) {
    var classes = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop) && obj[prop]) {
        classes.push(prop);
      }
    }
    return classes.join(' ');
  }
  exports.createStyleString = function (obj) {
    var classes = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop) && obj[prop]) {
        classes.push(prop + ':' + obj[prop]);
      }
    }
    return classes.join(';');
  }

  return exports;

}());
var config = (function () {

  var exports = {
    json: true,
    baseUrl: '',
    popstate: false,
    autoRoute: true
  };

  return exports;

}());
var jfluxRoute = (function (utils, config) {

  var exports = {};

  var routes = [];

  var initialRouting = true;
  
  exports.triggerRoute = function (route, compiledRoute, params) {
    if (typeof route.callback === 'string') {
      exports.resolveRoute(route.callback);
    } else if (config.popstate) {
      if (!initialRouting && route.path === location.pathname) {
        window.history.replaceState({}, '', compiledRoute);
      } else {
        window.history.pushState({}, '', compiledRoute);
        route.callback(params);
        initialRouting = false;
      }
    } else {
      if (initialRouting || route.path !== location.pathname) {
        location.href = config.baseUrl + '/#' + compiledRoute;
        route.callback(params);
        initialRouting = false;
      } 
    }
  };

  exports.resolveRoute = function (path) {
    for (var x = 0; x < routes.length; x++) {
      var route = routes[x];
      if (utils.matchRoute(path, route.path)) {
        var params = utils.getParams(path, route.path);
        return exports.triggerRoute(route, utils.compileRoute(route.path, params), params);
      }
    }
    throw new Error('No routes match ' + path);
  };

  exports.route = function (path, callback) {
    if (arguments.length !== 2) {
      throw new Error('You are passing the wrong arguments to createRoute()');
    }
    routes.push({
      path: config.popstate ? config.baseUrl + path : path,
      callback: callback
    });
  };

  exports.goTo = function (path) {
    $(function () {
      exports.resolveRoute(config.popstate ? config.baseUrl + path : path); 
    });
  };

  exports.deferTo = function (path) {
    return function () {
      exports.goTo(path);  
    };
  };

  return exports;

}(utils, config));
  var jflux = (function (jfluxRoute, config, utils) {

    var exports = {}; // Lib namespace
    var _renderedComponents = []; // TODO: Remove this?

    /*
     *  Render() takes a component and renders it to any
     *  target node. Any components within the component
     *  will also be rendered
     */
     exports.render = function (component, target) {
      var existingComponent = _renderedComponents.reduce(function (prev, next) {
        if (target === next.target) {
          return next;
        } else {
          return prev;
        }
      }, null);

      if (existingComponent && existingComponent.component._constr === component._constr &&
        !utils.deepCompare(existingComponent.component.props, component.props)) {
        existingComponent.component.props = component.props;
      existingComponent.component.update();
    } else if (!existingComponent || existingComponent.component._constr !== component._constr) {
      $(target).html(component._init());
      component.$el.on('destroy', component._remove.bind(component));
      _renderedComponents.push({
        component: component,
        target: target
      });
    }
  };

  var ids = 0;
  exports.generateId = function (identifier) {
    if (identifier) {
      return identifier + '_' + ids++;
    } else {
      return '' + ids++;
    }
  };

  exports.config = function (options) {
    if (!options) {
      return config;
    } else {
      utils.merge(options, config);
    }
  };

  exports.run =function () {

    $('body').on('click', 'a', function (event) {
      event.preventDefault();
      jfluxRoute.goTo(event.currentTarget.href.substr(location.origin.length)); 
    });

    if (config.popstate) {
      window.onpopstate = function () {
        jfluxRoute.resolveRoute(location.pathname);
      };
    } else {
        // TODO: onhashchange
      }
      // Initial routig passes full url, we have to remove the baseUrl
      // in path as it will be added in goTo()
      jfluxRoute.goTo(location.pathname.substr(config.baseUrl.length));

    };

    /*
     *  Returns the current relative path to baseUrl and hash,
     *  if popstate is not used
     */
     exports.path = function () {
      if (config.popstate) {
        return location.pathname.substr(config.baseUrl.length);
      } else {
        return location.hash.substr(1);
      }
    };

    /*
     * Register an event that triggers when component nodes are removed
     */
     $.event.special.destroy = {
      remove: function(o) {
        if (o.handler) {
          var component = o.handler();
          for (var x = 0; x < _renderedComponents.length; x++) {
            if (_renderedComponents[x].component === component) {
              _renderedComponents.splice(x, 1);
              return;
            }
          }
        }
      }
    }

    $(function () {
      if (!window.define && config.autoRoute) {
        exports.run();
      }
      if (config.json) {
        $.ajaxSetup({
          contentType: 'application/json',
          dataType: 'json'
        });
      }
    });

    return exports;

  }(jfluxRoute, config, utils));
var jfluxAction = (function (EventEmitter) {

  var exports = {};

  var createActionFunction = function () {
    var fn = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      fn.emit.apply(fn, ['trigger'].concat(args));
    };

    /*
     * Manually inherit EventEmitter to the function
     */
     for (var prop in EventEmitter.prototype) {
      if (EventEmitter.prototype.hasOwnProperty(prop)) {
        fn[prop] = EventEmitter.prototype[prop];
      }
    }

    return fn;
  }

  /*
   * Create a function that when called triggers
   * a "trigger" event on itself, passing the arguments
   * and lets any listeners know about it
   */
   exports.action = function () {

    if (Array.isArray(arguments[0])) {
      var actionMap = {};
      arguments[0].forEach(function (actionName) {
        actionMap[actionName] = createActionFunction();
      });
      return actionMap;
    } else if (!arguments.length) {
      return createActionFunction();
    }

    throw new Error('action() takes no arguments or an array of strings');

  };

  return exports;

}(EventEmitter));
var jfluxComponent = (function (utils) {

  var exports = {};

  var _components = [];
  exports.convertAttributes = function ($el, context) {

    if ($el.attr('$$-id')) {
      var value = utils.grabContextValue(context, $el.attr('$$-id'));
      $el.attr('id', value);
      $el.removeAttr('$$-id');
    }
    if ($el.attr('$$-class')) {
      var value = utils.grabContextValue(context, $el.attr('$$-class'));
      var classString = utils.createClassString(value);
      if (classString) $el.attr('class', classString);
      $el.removeAttr('$$-class');
    }
    if ($el.attr('$$-style')) {
      var value = utils.grabContextValue(context, $el.attr('$$-style'));
      var classString = utils.createStyleString(value);
      if (classString) $el.attr('style', classString);
      $el.removeAttr('$$-style');
    }
    if ($el.attr('$$-checked')) {
      var value = utils.grabContextValue(context, $el.attr('$$-checked'));
      $el.attr('checked', value);
      $el.removeAttr('$$-checked');
    }
    if ($el.attr('$$-disabled')) {
      var value = utils.grabContextValue(context, $el.attr('$$-disabled'));
      $el.attr('disabled', value);
      $el.removeAttr('$$-disabled');
    }
    if ($el.attr('$$-value')) {
      var value = utils.grabContextValue(context, $el.attr('$$-value'));
      $el.val(value);
      $el.removeAttr('$$-value');
    }
    return $el;
  };
  exports.createDomNodeRepresentation = function (arg, context) {
    if (typeof arg === 'object') { /* is jFramework component */
      return arg;
    }
    arg += ''; // Make it a string
    if (arg.match(/<.*\/>/)) {
      return {
        hasChildren: false,
        node: exports.convertAttributes($(arg), context)
      };
    } else if (arg.match(/<.*>.*<\/.*>/)) { /* Complete element */
      return {
        hasChildren: false,
        node: exports.convertAttributes($(arg), context)
      };
    } else if (arg.match(/<\/.*>/)) {
      return {
        hasChildren: false,
        node: null
      }
    } else if (arg.match(/<.*>/)) {
      return {
        hasChildren: true,
        node: exports.convertAttributes($(arg), context)
      }
    } else if (typeof arg === 'string') {
      return {
        hasChildren: false,
        node: $(document.createTextNode(arg))
      }
    }
  };

  exports.jComponent = function (props) {
    this._preRenders = [];
    this._isRendering = false;
    this._bindings = [];
    this._components = [];
    this._renders = [];
    this._attributes = [];
    this._listeners = [];
    this._plugins = [];
    this._objectListeners = []; // State changes
    this._renderArgs = [];
    this.props = props || {};
  };

  exports.jComponent.prototype = {
    constructor: exports.jComponent,
    _init: function (renders) {

      this._renders = this.render(this._template.bind(this));
      if (!this._renders) {
        throw new Error('You are not returning a template from the render function');
      }
      this._preRenders = this._renders;

      var $mainNode = this._compile(this._renders, true);
      this._addBindings($mainNode);
      this._addListeners($mainNode);
      this.$el = $mainNode;
      return $mainNode;

    },
    _remove: function () {
      this._objectListeners.forEach(function (listener) {
        listener.target.removeListener(listener.type, listener.cb);
      });
      this._components.forEach(function (component) {
        component._remove();
      });
      this.$el.remove();
      return this;
    },
    _flatten: function (array) {
      return array.reduce(function (returnArray, value) {
        returnArray = returnArray.concat(value);
        return returnArray;
      }, []);
    },
    _compile: function (renders, registerComponents) {
      var initNode = $();
      for (var x = 0; x < renders.length; x++) {
        if (Array.isArray(renders[x]) && renders[x].isChildArray) {
          initNode.last().append(this._compile(renders[x])); 
        } else if (Array.isArray(renders[x])) {
          initNode = initNode.add(this._compile(this._flatten(renders[x])));
        } else if (renders[x] instanceof exports.jComponent) {
          initNode = initNode ? initNode.add(renders[x]._init()) : renders[x]._init();
          if (registerComponents) {
            this._components.push(renders[x]);
          }
        } else {
          initNode = initNode ? initNode.add(renders[x]) : renders[x];
        }
      }
      return initNode;
    },

    _render: function () {
      this._isRendering = true;
      this._renders = this.render(this._template.bind(this));
      this._isRendering = false;
    },

    _addBindings: function ($mainNode) {

      var component = this;
      this._bindings.forEach(function (binding) {
        var $el = binding.selector ? $mainNode.find(binding.selector) : $mainNode;
        if ($el.is(':checkbox')) {
          $el.on('change', function () {
            binding.obj[binding.key] = $el.prop('checked');
            component.update();
          });
        } else {
          $el.on('keydown', function () {
            setTimeout(function () {
              binding.obj[binding.key] = $el.val();
              component.update();
            }, 0);
          });   
        }

      });
    },

    _addListeners: function ($mainNode) {
      var component = this;
      this._listeners.forEach(function (listener) {
        if (listener.target) {
          $mainNode.on(listener.type, listener.target, function (event) {
            listener.cb.call(component, $(event.currentTarget), event);
          });
        } else {
          $mainNode.on(listener.type, function (event) {
           listener.cb.call(component, $(event.currentTarget), event);     
         });
        }
      });
    },
    _addPlugins: function () {
      this._plugins.forEach(function (plugin) {
        if (plugin.target) {
          this.$(plugin.target)[plugin.name](plugin.options);  
        } else if (Array.isArray(plugin.options)) {
          this.$el[plugin.name].call(this.$el, plugin.options);
        } else {
          this.$el[plugin.name](plugin.options);    
        }
      }, this);
    },
    _template: function () {
      var renderArgs = Array.prototype.slice.call(arguments, 0);
      var initLevel = [];
      var currentLevel = initLevel;
      var prevLevels = [initLevel];
      for (var x = 0; x < renderArgs.length; x++) {
        var renderArg = renderArgs[x];
        var domNodeRepresentation = exports.createDomNodeRepresentation(renderArg, this);

        if (typeof renderArg === 'object') { /* is jComponent, fix better check */
          currentLevel.push(domNodeRepresentation);
        } else if (domNodeRepresentation.node) {
          currentLevel.push(domNodeRepresentation.node);
        } else {
          prevLevels.pop();
          currentLevel = prevLevels[prevLevels.length - 1];
          continue;
        }

        if (domNodeRepresentation.hasChildren) {
          var newLevel = [];
          newLevel.isChildArray = true; // Tells the renderer that this is an array of children
          currentLevel.push(newLevel)
          currentLevel = newLevel;
          prevLevels.push(newLevel);
        }
      }
      return initLevel;
    },
    _diff: function (renders, preRenders, node) {
      renders = renders || this._renders;
      preRenders = preRenders || this._preRenders;
      for (var x = 0; x < renders.length; x++) {
        if (Array.isArray(renders[x]) && renders[x].isChildArray) {
          this._diff(renders[x], preRenders[x], preRenders[x-1]);
        } else if (Array.isArray(renders[x])) {
          if (renders[x].length > preRenders[x].length) {
            var rendersIds = renders[x].map(function (render) {
              return render[0] instanceof exports.jComponent ? render[0].$el.attr('id') : render[0].attr('id');
            });
            var preRendersIds = preRenders[x].map(function (preRender) {
              return preRender[0] instanceof exports.jComponent ? preRender[0].$el.attr('id') : preRender[0].attr('id');
            });
            rendersIds.forEach(function (id, index) {
              // If at end of list
              if (preRendersIds.indexOf(id) === -1 && index >= preRenders[x].length) {
                node.append(this._compile(renders[x][index])); // Add node to list
                preRenders[x].push(renders[x][index]); // Add to array
              } else if (preRendersIds.indexOf(id) === -1) {
                renders[x][index][0].insertBefore(this._compile(preRenders[x][index])); // Insert before current in list
                preRenders[x].splice(index, 0, renders[x][index]);
              }
            }, this);
          } else if (renders[x].length < preRenders[x].length) {
            var rendersIds = renders[x].map(function (render) {
              return render[0] instanceof exports.jComponent ? render[0].$el.attr('id') : render[0].attr('id');
            });
            var preRendersIds = preRenders[x].map(function (preRender) {
              return preRender[0] instanceof exports.jComponent ? preRender[0].$el.attr('id') : preRender[0].attr('id');
            });
            for (var y = preRendersIds.length - 1; y >= 0; y--) {
              var id = preRendersIds[y];
              if (rendersIds.indexOf(id) === -1) {
                preRenders[x][y][0] instanceof exports.jComponent ? preRenders[x][y][0]._remove() : preRenders[x][y][0].remove(); // Remove main node
                preRenders[x].splice(y, 1); // Remove from array
              }
            };
          } else {
            this._diff(renders[x], preRenders[x]);
          }

        } else if (renders[x] instanceof exports.jComponent) { // Is an other component
          var oldProps = preRenders[x]._props;
          var newProps = renders[x].props;
          preRenders[x].props = newProps;
          var propsChanged = !utils.deepCompare(oldProps, newProps); // TODO: Create hash instead
          if (propsChanged) {
            preRenders[x].update();
          }
        } else if (renders[x].get(0).nodeType === 3 && renders[x].text() !== preRenders[x].text()) {
          preRenders[x].get(0).nodeValue = renders[x].text();
        }

        if (renders[x] instanceof jQuery) {
          var currentAttributes = preRenders[x].get(0).attributes;
          var attributes = renders[x].get(0).attributes;
          if (attributes && Object.keys(currentAttributes).length <= Object.keys(attributes).length) {
            for (var attr in attributes) {
              if (attributes.hasOwnProperty(attr) && attributes[attr].name &&
                (!currentAttributes[attr] || attributes[attr].value !== currentAttributes[attr].value)) {
                if (attributes[attr].name === 'checked') { // bug fix
                  preRenders[x].get(0).checked = true;
                }
                preRenders[x].attr(attributes[attr].name, attributes[attr].value || true);
              }
            }
          } else if (currentAttributes) {
            for (var attr in currentAttributes) {
              if (currentAttributes.hasOwnProperty(attr) && currentAttributes[attr].name && !attributes[attr]) {
               preRenders[x].removeAttr(currentAttributes[attr].name);
             } else if (attributes.hasOwnProperty(attr) && attributes[attr].name &&
              attributes[attr].value !== currentAttributes[attr].value) {
              preRenders[x].attr(attributes[attr].name, attributes[attr].value || true);  
            }
          }  
        }

      }
    }
  },
  $: function (query) {
    return this.$el.find(query);
  },
  update: function (props) {
    this._render();
    this._compile(this._renders);
    this._diff();
  },
  attribute: function () {

  },
  render: function (compile) {
    return compile(
      '<div></div>'
      );
  },
  listenTo: function (type, target, cb) {
    if (this._isRendering) {
      throw new Error('Do not run listenTo() in your render callback');
    }
    if (typeof type === 'object') {
      cb = target.bind(this);
      target = type;
      type = 'update';
      target.on(type, cb);
      this._objectListeners.push({
        type: type,
        target: target,
        cb: cb
      });
    } else {
      this._listeners.push({
        type: type,
        target: typeof target === 'function' ? null: target,
        cb: typeof cb === 'function' ? cb: target
      });
    }
  },
  plugin: function () {
    if (this._isRendering) {
      throw new Error('Do not run plugin() in your render callback');
    }
    var name = arguments[0];
    var target = typeof arguments[1] === 'string' ? arguments[1] : null;
    var options = arguments.length === 3 ? arguments[2] : arguments[1];
    this._plugins.push({
      name: name,
      target: target,
      options: options
    });
  },
  bind: function (obj, key, selector) {
    if (this._isRendering) {
      throw new Error('Do not run plugin() in your render callback');
    }
    this._bindings.push({
      obj: obj,
      key: key,
      selector: selector
    });
  },
  map: function (array, cb) {
    var component = this;
    return array.map(function (item) {
      return cb.call(item, component._template.bind(item));
    });
  }
};

exports.component = function (constr) {
  return function (props) {
    var component = new exports.jComponent(props);
    constr.call(component, component._template.bind(component));
    component._constr = constr;
    _components.push(component);
    return component; 
  }
};

return exports;

}(utils))
  var jfluxState = (function (EventEmitter, utils) {

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
      }
    };

    return state;

  }(EventEmitter, utils)); return {
   render: jflux.render,
   component: jfluxComponent.component,
   state: jfluxState,
   route: jfluxRoute.route,
   action: jfluxAction.action,
   generateId: jflux.generateId,
   run: jflux.run,
   path: jflux.path,
   config: jflux.config
 };

}));
//# sourceMappingURL=jflux.js.map