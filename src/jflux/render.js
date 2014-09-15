/*
 * RENDER
 * ====================================================================================
 * Initializes and appends a component to the DOM. It does a lookup to check if
 * there already is a component where it will either update by replacing the properties
 * or remove the old one and append the new one. If no components registered the
 * new component will be appended
 * ====================================================================================
 */

var dom = require('./../dom.js');
var utils = require('./../utils.js');

// Components rendered to the DOM will be stored in this array, as a lookup
var _renderedComponents = [];

// Register an event that triggers when component nodes are removed
if (dom.$.event) {
  dom.$.event.special.destroy = {
    remove: function (listener) {

      // The "destroy" callback (handler) removes the component and returns it
      var component = listener.handler();
      utils.removeFromListByProp(_renderedComponents, 'component', component);

    }
  };
}

var render = function (component, target) {

  var existingComponent = utils.getFromListByProp(_renderedComponents, 'target', target);

  // If there is an existing component of same type and the props has changed,
  // update existing component
  if (existingComponent &&
      existingComponent._constr === component._constr
      && !utils.deepCompare(existingComponent.props, component.props)) {

    existingComponent.props = component.props;
    existingComponent.update();

    // If no existing component or the component type has changed,
    // initialize a new component
  } else if (!existingComponent || existingComponent._constr !== component._constr) {

    component._init();
    dom.$(target).html(component.$el);
    _renderedComponents.push({
      component: component,
      target: target
    });

  }
};

module.exports = render;