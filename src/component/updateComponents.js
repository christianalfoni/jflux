var utils = require('./../utils.js');

module.exports = function (component) {

    var nestedComponents = component._components

    // Remove any components that are not valid anymore
    Object.keys(nestedComponents.map).forEach(function (key) {

      if (!nestedComponents.updateMap[key]) {
        nestedComponents.map[key]._remove(); // Need to remove element?
        delete nestedComponents.map[key];
      }

    });

    // Update or add new components
    Object.keys(nestedComponents.updateMap).forEach(function (key) {
      
      // If not added in previous map or the type of component has changed,
      // replace it
      if (!nestedComponents.map[key] || nestedComponents.updateMap[key]._description !== nestedComponents.map[key]._description) {
        nestedComponents.map[key] = nestedComponents.updateMap[key];
        component.$el.find('#' + key).html(nestedComponents.map[key]._init().$el);
        return;
      }

      if (!Object.keys(nestedComponents.updateMap[key].props).length || !Object.keys(nestedComponents.map[key].props).length) {
        return;
      }

      var isSame = utils.deepCompare(nestedComponents.updateMap[key].props, nestedComponents.map[key].props);
      if (!isSame) {
      
        nestedComponents.map[key].props = nestedComponents.updateMap[key].props;
        nestedComponents.map[key].update();
      }
    
    });

};