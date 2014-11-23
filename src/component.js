/*
 * COMPONENT
 * ====================================================================================
 * Composable components that only updates diffs etc.
 * ====================================================================================
 */

 var dom = require('./dom.js');
 var utils = require('./utils.js');
 var Constructor = require('./component/Constructor.js');
 var error = require('./error.js');
 var convertAttributes = require('./component/convertAttributes.js');
 var h = require('virtual-dom/h');
 var diff = require('virtual-dom/diff');
 var patch = require('virtual-dom/patch');
 var createElement = require('virtual-dom/create-element');
 var updateComponents = require('./component/updateComponents.js');
 var dataStore = require('./dataStore.js');
 var config = require('./config.js');
 var exports = {};

 Constructor.prototype = {
  constructor: Constructor,

  // Runs when the component is added to the DOM by $$.render
  _init: function () {

    if (this.init) {
      this.init();
    }

    this._VTree = this._renderByMode();

    if (!this._VTree) {
      error.create({
        source: this._renders,
        message: 'Missing compiled DOM representation',
        support: 'You have to return a compile call from the render method',
        url: 'https://github.com/christianalfoni/jflux/blob/master/DOCUMENTATION.md#components-createacomponent'
      });
    }

    // Compile the renders, add bindings and listeners
    var el = createElement(this._VTree);
    this.$el = dom.$(el);

    // Put components into DOM tree and keep a reference to it in the map, for later
    // updates
    this.$el.find('component').each(function (index, component) {
      dom.$(component).replaceWith(this._components.updateMap[component.id]._init().$el);
      this._components.map[component.id] = this._components.updateMap[component.id];
    }.bind(this));

    this._addBindings();
    this._addListeners();

    this.$el.on('destroy', this._remove.bind(this));

    if (this.afterRender) {
      this.afterRender();
    }

    return this;

  },

  _renderByMode: function () {

    var Handlebars = config().handlebars;
    var component = this;

    // If using handlebars we have to register helpers to register component helpers
    if (Handlebars) {
      this._registerHandlebarsComponentHelpers();
    }

    // Render the component and based on it just being a string response pass it to the builVTree method (template)
    // or if it is a VTree already (traditional compile)
    var args = Handlebars ? [] : [this._compiler.bind(this)];
    var render = this.render ? this.render.apply(this, args) : this.template(this);
    if (typeof render === 'string') {
      return this._buildVTree(render, this, this);
    } else {
      return render;
    }

  },

  _registerHandlebarsComponentHelpers: function () {

    var Handlebars = config().handlebars;
    var component = this;
    Object.keys(this.components).forEach(function (helperName) {
      Handlebars.registerHelper(helperName, function (options) {
        var id = component._currentNodeIndex++;
        component._components.updateMap[id] = component.components[helperName](options.hash, options.fn(this));
        return '<!--Component:'+ id + '-->';
      });
    });

  },

  // Cleans up the listeners and removes the component from the DOM
  _remove: function () {
    this._listeners.forEach(function (listener) {
      listener.target.removeListener(listener.type, listener.cb);
    });
    dataStore.clear(this._dataStoreId);
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
          $el.trigger('$$-change');
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
              $el.trigger('$$-change');
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

  _buildVTree: function (html, context, component) {

    var traverse = function (node) {

      // If top node is a component, return a component
      if (node.nodeType === 8 && node.nodeValue.match(/Component\:.*/)) {
        return h('component', {
          id: node.nodeValue.match(/Component\:(.*)/)[1]
        }, []);
      }

      // Props map
      var props = {};

      // Handle properties specifically with handlebars
      if (config().handlebars) {

        if (node.value) {
          props.value = node.value;
        }
        if (node.checked) {
          props.checked = node.checked;
        }

      }

      // Supplement with attributes on the node
      if (node.attributes) {
        props.attributes = {};
        for (var x = 0; x < node.attributes.length; x++) {
          var nodeName = node.attributes[x].nodeName;
          var nodeValue = node.attributes[x].nodeValue;
          props.attributes[nodeName] = nodeValue;
        }
      }

      // Convert the jFlux attributes if not using handlebars
      if (!config().handlebars) {
        convertAttributes(props, node, context, component);
      }

      // Create VTree node
      return h(node.tagName, props, 

        (function () {

          var children = [];
          for (var x = 0; x < node.childNodes.length; x++) {
            var childNode = node.childNodes[x];
            // Use a text node with special content that refers to a prop
            // on this component where the list is located
            if (childNode.nodeType === 8 && childNode.nodeValue === 'VTreeNodeList') {
              children = children.concat(component._VTreeLists.shift());
            } else if (childNode.nodeType === 3) {
              children.push(childNode.nodeValue);
            } else {
              var el = traverse(childNode);
              children.push(el);
            }
          }
          return children;

        }())
        )
    };

    // Need to use jQuery to handle any kind of top node
    var $node = dom.$(html);
    return traverse($node[0]);

  },

  _compiler: function () {

    var html = '';
    var context = this; // Either component or map context    
    var component = this._component || this;
    var args = Array.prototype.slice.call(arguments, 0);
    var traverseArgs = function (args) {
      args.forEach(function (arg) {
        var id = component._currentNodeIndex++;
        if (arg instanceof Constructor) {
          component._components.updateMap[id] = arg;
          html += '<!--Component:'+ id + '-->';
        } else if (arg._childrenArray) {
          traverseArgs(arg);
        } else if (Array.isArray(arg)) {
          component._VTreeLists.push(arg);
          html += '<!--VTreeNodeList-->';
        } else {
          html += arg;
        }
      });
    };
    traverseArgs(args);

    return component._buildVTree(html, context, component);

  },
  $: function (query) {
    return this.$el.find(query);
  },

  update: function () {

    this._currentNodeIndex = 0;
    this._VTreeLists = [];
    this._components.updateMap = {};
    dataStore.clear(this._dataStoreId);

    var newVTree = this._renderByMode();
    var patches = diff(this._VTree, newVTree);
    patch(this.$el[0], patches);
    this._VTree = newVTree;
    updateComponents(this);
  },

  listenToChange: function (target, cb) {
    this.listenTo(target, 'change', cb);
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
        index: index,
        _component: component
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