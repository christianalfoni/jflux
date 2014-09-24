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

var exports = {};

Constructor.prototype = {
  constructor: Constructor,

  // Runs when the component is added to the DOM by $$.render
  _init: function () {

    // Render the component and set it as the current render and the initial render
    this._renders = this._initialRenders = this.render(this._compiler.bind(this));

    if (!this._renders) {
      throw new Error('You are not returning a template from the render function');
    }

    // Compile the renders, add bindings and listeners
    this.$el = compile(this._renders, this._components);

    this._addBindings();
    this._addListeners();
    this._addStateListeners();

    if (this.afterRender) {
      this.afterRender();
    }

    return this;

  },

  // Cleans up the listeners and removes the component from the DOM
  _remove: function () {

    this._stateListeners.forEach(function (listener) {
      listener.target.removeListener(listener.type, listener.cb);
    });

    this._components.forEach(function (component) {
      component._remove();
    });

    this.$el.remove();

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
    this._bindings.forEach(function (binding) {

      var $el = binding.selector ? component.$(binding.selector) : component.$el;
      if ($el.is(':checkbox')) {

        $el.on('change', function () {
          binding.obj[binding.key] = $el.prop('checked');
          component.update();
        });

      } else {

        $el.on('keydown', function () {

          // Use setTimeout to grab the value after keydown has run.
          // Gives the best experience
          setTimeout(function () {
            binding.obj[binding.key] = $el.val();
            component.update();
          }, 0);
        });

      }

    });
  },

  // Adds interaction listeners, like "click" etc.
  _addListeners: function () {
    var component = this;
    this._listeners.forEach(function (listener) {

      if (listener.target) {
        component.$el.on(listener.type, listener.target, function (event) {
          var $target = dom.$(event.currentTarget);
          var data = $target.data('data');
          if (data) {
            listener.cb.call(component, data, $target, event);
          } else {
            listener.cb.call(component, $target, event);
          }
        });
      } else {
        component.$el.on(listener.type, function (event) {
          var data = dom.$.data(component.$el[0], 'data');
          if (data) {
            listener.cb.call(component, data, event);
          } else {
            listener.cb.call(component, event);
          }

        });
      }

    });
  },

  _addStateListeners: function () {
    this._stateListeners.forEach(function (listener) {

      listener.target.on(listener.type, listener.cb);

    });
  },

  // Triggers plugins on elements
  _addPlugins: function () {

    this._plugins.forEach(function (plugin) {

      if (plugin.target) {
        this.$(plugin.target)[plugin.name](plugin.options);
      } else if (Array.isArray(plugin.options)) {
        this.$el[plugin.name].apply(this.$el, plugin.options);
      } else {
        this.$el[plugin.name](plugin.options);
      }

    }, this);

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
  listenTo: function (type, target, cb) {

    if (this._isRendering) {
      throw new Error('Do not run listenTo() in your render callback');
    }

    // If first or second argument is an object, it is a state listener
    if (typeof type === 'object' || typeof target === 'object') {

      cb = arguments.length === 3 ? cb.bind(this) : target.bind(this);
      target = arguments.length === 3 ? target : type;
      type = arguments.length === 3 ? type : 'update';
      this._stateListeners.push({
        type: type,
        target: target,
        cb: cb
      });

    } else {

      this._listeners.push({
        type: type,
        target: typeof target === 'function' ? null : target,
        cb: typeof cb === 'function' ? cb : target
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

module.exports = function (constr) {
  return function (props) {
    var component = new Constructor(props);
    constr.call(component);
    component._constr = constr;
    return component;
  }
};