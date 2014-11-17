var dom = require('./../dom.js');
var dataStore = require('./../dataStore.js');

function Component (props, children) {

  // Used to keep track of components and data
  this._dataStoreId = dataStore.create();
  this._currentNodeIndex = 0;
  this.events = {};
  this.bindings = {};
  this._isInitialized = false;
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
  this.props = props || {};
  this.props.children = [];

}

module.exports = Component;