var jQuery = global.jQuery || require('jquery');
var compile = require('./compile.js');
var Constructor = require('./Constructor.js');
var addToList = require('./diff/addToList.js');
var removeFromList = require('./diff/removeFromList.js');
var diffAttributes = require('./diff/diffAttributes.js');
var utils = require('./../utils.js');

var diff = function (renders, initialRenders, node) {

  renders.forEach(function (renders, index) {

    // If it is an array of children, diff that array
    if (Array.isArray(renders) && renders.isChildArray) {
      diff(renders, initialRenders[index], initialRenders[index - 1]);

      // If it is a normal array (list of DOM representations)
    } else if (Array.isArray(renders)) {

      if (renders.length > initialRenders[index].length) {
        addToList(renders, initialRenders[index], node);
      } else if (renders.length < initialRenders[index].length) {
        removeFromList(renders, initialRenders[index]);
      } else {
        diff(renders, initialRenders[index]);
      }

      // If it is a component
    } else if (renders instanceof Constructor) {

      // Grab properties
      var oldProps = initialRenders[index]._props;
      var newProps = renders.props;

      var propsChanged = !utils.deepCompare(oldProps, newProps); // TODO: Create hash instead
      if (propsChanged) {
        initialRenders[index].props = newProps;
        initialRenders[index].update();
      }

      // If it is a text node
    } else if (renders.get(0).nodeType === 3 && renders.text() !== initialRenders[index].text()) {

      initialRenders[index].get(0).nodeValue = renders.text();

    } else if (renders instanceof jQuery) {

      diffAttributes(renders, initialRenders[index]);

    }

  });

};

module.exports = diff;