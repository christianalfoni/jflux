/*
 * CONVERTATTRIBUTES
 * ====================================================================================
 * Converts jFlux attributes to HTML attributes, and them removes the jFlux version.
 * The jFlux attribute is a property on a context. The value fetched is then use
 * to set the correct HTML attribute
 * ====================================================================================
 */
var dom = require('./../dom.js');
var utils = require('./../utils.js');
var dataStore = require('./../dataStore.js');

var converters = {
  '$$-id': function (node, value, props, context) {
    props['id'] = utils.grabContextValue(context, value);
    delete props.attributes['$$-id'];
  },
  '$$-class': function (node, value, props, context) {
    var attrValue = utils.grabContextValue(context, value);
    var classString = utils.createClassString(attrValue);
    if (classString) props['className'] = classString;
    delete props.attributes['$$-class'];
  },
  '$$-style': function (node, value, props, context) {
    props['style'] = utils.grabContextValue(context, value);
    delete props.attributes['$$-style'];
  },
  '$$-checked': function (node, value, props, context) {
    props['checked'] = utils.grabContextValue(context, value);
    delete props.attributes['$$-checked'];
  },
  '$$-disabled': function (node, value, props, context) {
    props['disabled'] = utils.grabContextValue(context, value);
    delete props.attributes['$$-disabled'];
  },
  '$$-value': function (node, value, props, context) {
    props['value'] = utils.grabContextValue(context, value);
    delete props.attributes['$$-value'];
  },
  '$$-href': function (name, value, props, context) {
    props['href'] = utils.grabContextValue(context, value);
    delete props.attributes['$$-href'];
  },
  '$$-show': function (node, value, props, context) {
    var show = utils.grabContextValue(context, value);
    props.style = props.style || {};
    if (show) {
      props.style.display = window.getComputedStyle(node, null).display;
    } else {
      props.style.display = 'none';
    }
    delete props.attributes['$$-show'];
  },
  '$$-hide': function (node, value, props, context) {
    var hide = utils.grabContextValue(context, value);
    props.style  = props.style || {};
    if (hide) {
      props.style.display = 'none';
    } else {
      props.style.display = window.getComputedStyle(node, null).display;
    }
    delete props.attributes['$$-hide'];
  },
  '$$-key': function (node, value, props, context) {
    props['key'] = utils.grabContextValue(context, value);
    delete props.attributes['$$-key'];
  },
  '$$-data': function (node, value, props, context, component) {
    dataStore.add(component._dataStoreId, component._currentNodeIndex, utils.grabContextValue(context, value));
    props.attributes['data-store'] = component._dataStoreId + '_' + component._currentNodeIndex;
    delete props.attributes['$$-data'];
  }
};

var convertAttributes = function (props, node, context, component) {

  Object.keys(node.attributes).forEach(function (attr) {
    var name = node.attributes[attr].nodeName;
    if (name && converters[name]) {
      var value = node.attributes[attr].nodeValue;
      converters[name](node, value, props, context, component);
    }
  });

};

module.exports = convertAttributes;