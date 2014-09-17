// Compiles DOM representations to a jQuery object. "registerComponents" is used
// by "_init" to register nested components for later removal
var dom = require('./../dom.js');
var utils = require('./../utils.js');
var Constructor = require('./Constructor.js');

var compile = function (renders, componentsList) {

  var topNode = dom.$();
  renders.forEach(function (render) {

    // If the render is an array of children, append them
    // to the last child of the topNode
    if (Array.isArray(render) && render.isChildArray) {

      topNode.last().append(compile(render), componentsList);

      // If the render is a normal array, meaning it is an array of compiled
      // objects (Like using this.map to create a list in the component). Flatten
      // the array, compile it and append to the top node
    } else if (Array.isArray(render)) {

      topNode = topNode.add(compile(utils.flatten(render), componentsList));

      // If the render is a component, initialize it and append. If
      // this is during initializing add the component to a lookup list
    } else if (render instanceof Constructor) {

      topNode = topNode.add(render._init().$el);

      if (componentsList) {
        componentsList.push(render);
      }

      // If it is just a jQuery object, append it
    } else {
      topNode = topNode.add(render);
    }

  });
  return topNode;
};

module.exports = compile;