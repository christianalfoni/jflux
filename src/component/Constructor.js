function Component (props) {
  this._initialRenders = [];
  this._isRendering = false;
  this._bindings = [];
  this._components = [];
  this._renders = [];
  this._listeners = [];
  this._plugins = [];
  this._stateListeners = []; // State changes
  this.props = props || {};
}

module.exports = Component;