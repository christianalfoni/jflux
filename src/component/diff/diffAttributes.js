var attributeHasChanged = function (currentAttribute, newAttribute) {
  return newAttribute.name && (!currentAttribute || newAttribute.value !== currentAttribute.value);
};

var diffAttributes = function (renders, initialRenders) {


  var currentAttributes = initialRenders.get(0).attributes;
  var newAttributes = renders.get(0).attributes;

  // Check if number of attributes is less or the same. If so
  // the .attr() method will either add or change value
  var attributesCountChanged = newAttributes && Object.keys(currentAttributes).length <= Object.keys(newAttributes).length;
  if (attributesCountChanged) {

    for (var attr in newAttributes) {

      if (newAttributes.hasOwnProperty(attr) && attributeHasChanged(currentAttributes[attr], newAttributes[attr])) {

        if (newAttributes[attr].name === 'checked') { // TODO: Verify this!
          initialRenders.get(0).checked = true;
        }

        initialRenders.attr(newAttributes[attr].name, newAttributes[attr].value || true);

      }

    }

  } else if (currentAttributes) {

    for (var attr in currentAttributes) {

      if (currentAttributes.hasOwnProperty(attr) && currentAttributes[attr].name && !newAttributes[attr]) {

        initialRenders.removeAttr(currentAttributes[attr].name);

      } else if (newAttributes.hasOwnProperty(attr) && attributeHasChanged(currentAttributes[attr], newAttributes[attr])) {

        initialRenders.attr(newAttributes[attr].name, newAttributes[attr].value || true);

      }
    }
  }

};

module.exports = diffAttributes;