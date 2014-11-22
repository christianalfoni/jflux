var dom = require('./../dom.js');
var dataStore = require('./../dataStore.js');

function Component (props, children) {

  // Used to keep track of components and data
  this._dataStoreId = dataStore.create();

  // Used by traditional compile to set an ID on nested components, but also by
  // templating to set ID using helpers
  this._currentNodeIndex = 0;
  this._VTree = null;
  this._VTreeLists = [];
  this._components = {
    map: {}, // Where we map the components that are actually in the DOM
    updateMap: {} // Where we put our components that are rendered on update an might move to map
  };
  this._isRendering = false;
  this._bindings = [];
  this._listeners = [];
  this._children = children;

  this.events = {};
  this.bindings = {};
  this.props = props || {};
  this.props.children = children || [];
  this.props.children._childrenArray = true;

  // Used by templating version to expose components to templates
  this.components = {};

}

module.exports = Component;