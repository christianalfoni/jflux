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