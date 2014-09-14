/*
 * CONVERTATTRIBUTES
 * ====================================================================================
 * Converts jFlux attributes to HTML attributes, and them removes the jFlux version.
 * The jFlux attribute is a property on a context. The value fetched is then use
 * to set the correct HTML attribute
 * ====================================================================================
 */
var utils = require('./../utils.js');

var converters = {
  '$$-id': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-id'));
    $el.attr('id', value);
  },
  '$$-class': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-class'));
    var classString = utils.createClassString(value);
    if (classString) $el.attr('class', classString);
  },
  '$$-style': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-style'));
    var styleString = utils.createStyleString(value);
    if (styleString) $el.attr('style', styleString);
  },
  '$$-checked': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-checked'));
    $el.attr('checked', value);
  },
  '$$-disabled': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-disabled'));
    $el.attr('disabled', value);
  },
  '$$-value': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-value'));
    $el.val(value);
  },
  '$$-href': function ($el, context) {
    var value = utils.grabContextValue(context, $el.attr('$$-href'));
    $el.attr('href', value);
  }
};

var convertAttributes = function ($el, context) {

  Object.keys(converters).forEach(function (attr) {
    if ($el.attr(attr)) {
      converters[attr]($el, context);
      $el.removeAttr(attr);
    }
  });

  return $el;

};

module.exports = convertAttributes;