
module.exports = function (node) {
  var attrs = {};
  var removeAttrs = [];
  for (var x = 0; x < node.attributes.length; x++) {
    var attr = node.attributes[x];
    var name = attr.name;
    var value = attr.value;
    if (name === 'class') {
      name = 'className';
    }
    attrs[name] = value;
  }
  return attrs;
};