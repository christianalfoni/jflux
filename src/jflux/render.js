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

var render = function (component, target) {

  var existingRender = utils.getFromListByProp(_renderedComponents, 'target', target);

  // If there is an existing component of same type and the props has changed,
  // update existing component
  if (existingRender &&
    existingRender.component._constr === component._constr
      && !utils.deepCompare(existingRender.component.props, component.props)) {

    existingRender.component.props = component.props;
    existingRender.component.update();

    // If no existing component or the component type has changed,
    // initialize a new component
  } else if (!existingRender || existingRender.component._constr !== component._constr) {

    if (existingRender) {
      existingRender.component._remove();
      _renderedComponents.splice(_renderedComponents.indexOf(existingRender), 1);
    }
    component._init();
    dom.$(target).html(component.$el);
    _renderedComponents.push({
      component: component,
      target: target
    });

  }
};

module.exports = render;