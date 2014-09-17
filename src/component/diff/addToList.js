var Constructor = require('./../Constructor.js');
var compile = require('./../compile.js');

var addToList = function (renders, initialRenders, node) {

  // Collect IDs to compare them and figure out what items in list
  // already exists
  var rendersIds = renders.map(function (render) {
    return render[0] instanceof Constructor ? render[0].props.id : render[0].attr('id');
  });
  var initialRendersIds = initialRenders.map(function (initialRender) {
    return initialRender[0] instanceof Constructor ? initialRender[0].props.id : initialRender[0].attr('id');
  });

  // Iterate over list of new IDs and check if it exists in
  // the initial render
  rendersIds.forEach(function (id, index) {

    // If at end of or past list length, push it to the list
    if (initialRendersIds.indexOf(id) === -1 && index >= initialRenders.length) {

      // Append to current top node
      node.append(compile(renders[index]));

      // Push it into initial renders list for later handling
      initialRenders.push(renders[index]);

      // If current new ID is not part of initial render and we are not at end of list,
      // squeeze it into place
    } else if (initialRendersIds.indexOf(id) === -1) {

      compile(renders[index]).insertBefore(initialRenders[index][0]);
      initialRenders.splice(index, 0, renders[index]);

    }
  });
}

module.exports = addToList;