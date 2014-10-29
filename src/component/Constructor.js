var dom = require('./../dom.js');

function Component (props, children) {

  this.events = {};
  this.bindings = {};
  this._initialRenders = [];
  this._isRendering = false;
  this._bindings = [];
  this._renders = [];
  this._listeners = [];
  this._children = children;
  this.props = props || {};
  this.props.children = [];
}

module.exports = Component;