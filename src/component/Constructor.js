var dom = require('./../dom.js');

function Component (props, children) {

  this.events = {};
  this.bindings = {};
  this._isDirty = true;
  this._isInitialized = false;
  this._VTree = null;
  this._VTreeLists = [];
  this._components = {
    currentId: 0, // It maps to argument count
    map: {}, // Where we map the components that are actually in the DOM
    updateMap: {} // Where we put our components that are rendered on update an might move to map
  };
  this._isRendering = false;
  this._bindings = [];
  this._listeners = [];
  this._children = children;
  this.props = props || {};
  this.props.children = [];

  // Used to keep track of updates to the components array
  this._components._currentIndex = 0;

}

module.exports = Component;