/*
 * CREATEDOMNODEREPRESENTATION
 * ====================================================================================
 * Analyses the arguments passed to "compile" and returns a representation
 * ====================================================================================
 */
var $ = global.jQuery || require('jquery');
var convertAttributes = require('./convertAttributes.js');

var matchers = {
  short:  /<.*\/>/,
  long: /<.*>[\s\S]*<\/.*>/, // [\s\S] matches linebreaks too
  closing: /<\/.*>/,
  opening: /<.*>/
};

var createDomNodeRepresentation = function (arg, context) {

  // If it is an array, jQuery object or Component
  if (typeof arg === 'object') {
    return arg;
  }

  arg += ''; // Convert to string

  // E.g. "<div/>" or "<div></div>"
  if (arg.match(matchers.short) || arg.match(matchers.long)) {

    return {
      hasChildren: false,
      node: convertAttributes($(arg), context)
    };

    // E.g. "</div>"
  } else if (arg.match(matchers.closing)) {

    return {
      hasChildren: false,
      node: null
    }

    // E.g. "<div>"
  } else if (arg.match(matchers.opening)) {

    return {
      hasChildren: true,
      node: convertAttributes($(arg), context)
    }

    // E.g. "hello world"
  } else if (typeof arg === 'string') {

    return {
      hasChildren: false,
      node: $(document.createTextNode(arg))
    }

  }
};

module.exports = createDomNodeRepresentation;