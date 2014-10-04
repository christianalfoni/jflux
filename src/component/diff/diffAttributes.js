var dom = require('../../dom.js');

var attributes = [
  'style',
  'className',
  'disabled',
  'checked',
  'id',
  'value'
];

var diffAttributes = function (renders, initialRenders) {

  var currentEl = initialRenders.get(0);
  var newEl = renders.get(0);

  attributes.forEach(function (attribute) {
    if (!currentEl[attribute] && !newEl[attribute]) {
      return;
    }
    if (attribute === 'style' && initialRenders.attr('style') !== renders.attr('style')) {
      return initialRenders.attr('style', renders.attr('style'));
    } else if (attribute !== 'style' && currentEl[attribute] !== newEl[attribute]) {
      return currentEl[attribute] = newEl[attribute];
    }
  });

};

module.exports = diffAttributes;