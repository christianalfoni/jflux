var dom = require('../../dom.js');

var attributes = [
  {
    name: 'style',
    isAttr: true
  },
  {
    name: 'className'
  },
  {
    name: 'disabled'
  },
  {
    name: 'checked'
  },
  {
    name: 'id'
  },
  {
    name: 'value'
  },
  {
    name: 'data',
    isMethod: true
  }
];

var diffAttributes = function (renders, initialRenders) {

  var currentEl = initialRenders.get(0);
  var newEl = renders.get(0);

  attributes.forEach(function (attribute) {
    if (!attribute.isMethod && !currentEl[attribute.name] && !newEl[attribute.name]) {
      return;
    }
    if (attribute.isMethod && initialRenders[attribute.name]() !== renders[attribute.name]()) {
      return initialRenders[attribute.name](renders[attribute.name]());
    } else if (attribute.isAttr && initialRenders.attr(attribute.name) !== renders.attr(attribute.name)) {
      return initialRenders.attr(attribute.name, renders.attr(attribute.name));
    } else {
      return currentEl[attribute.name] = newEl[attribute.name];
    }
  });

};

module.exports = diffAttributes;