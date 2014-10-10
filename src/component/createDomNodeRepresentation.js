/*
 * CREATEDOMNODEREPRESENTATION
 * ====================================================================================
 * Analyses the arguments passed to "compile" and returns a representation
 * ====================================================================================
 */
var dom = require('./../dom.js');
var convertAttributes = require('./convertAttributes.js');
var error = require('./../error.js');

var matchers = {
  short:  /<.*\/>/,
  long: /<.*>[\s\S]*<\/.*>/, // [\s\S] matches linebreaks too
  closing: /<\/.*>/,
  opening: /<.*>/,
  input: /<input.*>/
};

var createDomNodeRepresentation = function (arg, context) {

  if (arg === null || arg === undefined) {
    error.create({
      source: arg,
      message: 'compile does not support null or undefined as argument',
      support: 'make sure you pass a supported type',
      url: 'https://github.com/christianalfoni/jflux/blob/master/DOCUMENTATION.md#components-compile'
    });
  }

  // If it is an array, jQuery object or Component
  if (typeof arg === 'object') {
    return arg;
  }

  arg += ''; // Convert to string

  // INPUT
  if (arg.match(matchers.input)) {

    return {
      hasChildren: false,
      node: convertAttributes(dom.$(arg), context)
    };

    // E.g. "<div/>" or "<div></div>"
  } else if (arg.match(matchers.short) || arg.match(matchers.long)) {

    return {
      hasChildren: false,
      node: convertAttributes(dom.$(arg), context)
    };

    // E.g. "</div>"
  } else if (arg.match(matchers.closing)) {

    return {
      hasChildren: false,
      node: null
    };

    // E.g. "<div>"
  } else if (arg.match(matchers.opening)) {

    return {
      hasChildren: true,
      node: convertAttributes(dom.$(arg), context)
    };

    // E.g. "hello world"
  } else if (typeof arg === 'string') {
    return {
      hasChildren: false,
      node: dom.$(dom.document.createTextNode(arg))
    }

  }
};

module.exports = createDomNodeRepresentation;