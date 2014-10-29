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
    this.$el = compile(this._renders, this);

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
    if (compilerArgs.indexOf(this.props.children) >= 0 && this._children.length) {
      compilerArgs.splice.apply(compilerArgs, [compilerArgs.indexOf(this.props.children), 1].concat(this._children));
    }
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
  return function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var props = args.shift();
    var base = new Constructor(props, args);
    var component = utils.mergeTo(base, description);
    component._description = description;
    return component;
  }
};