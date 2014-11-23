var dom = require('./dom.js');

var exports = {};

var convertAttributes = function (string, context) {
  string += '';
  var matches = string.match(/(?:\$\$-.*?="[^"]*")/g);
  if (matches) {
    matches.forEach(function (match) {
      var value = match.match(/"([^""]+)"/)[1];
      var newMatch = match.replace('"' + value + '"', '{' + JSON.stringify(context[value]) + '}');
      string = string.replace(match, '$' + newMatch)
    });
  }
  return string;
};

exports.convertArgsToString = function () {
 
  return html;
};

exports.deepClone = function (obj) {
  var copy, tmp, circularValue = '[Circular]', refs = [];

  // object is a false or empty value, or otherwise not an object
  if (!obj || "object" !== typeof obj || obj instanceof ArrayBuffer || obj instanceof Blob || obj instanceof File) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array - or array-like items (Buffers)
  if (obj instanceof Array || typeof obj.length !== 'undefined') {
    
    refs.push(obj);
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      if (refs.indexOf(obj[i]) >= 0) {
        copy[i] = circularValue;
      } else {
        copy[i] = exports.deepClone(obj[i]);
      }
    }
    refs.pop();
    return copy;
  }

  // Handle Object
  refs.push(obj);
  copy = {};

  if (obj instanceof Error) {
    //raise inherited error properties for the clone
    copy.name = obj.name;
    copy.message = obj.message;
    copy.stack = obj.stack;
  }

  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      if (refs.indexOf(obj[attr]) >= 0) {
        copy[attr] = circularValue;
      } else {
        copy[attr] = exports.deepClone(obj[attr]);
      }
    }
  }
  refs.pop();
  return copy;
};

exports.isParam = function (part) {
  var match = part.match(/^\{.*\}$/);
  return match && match.length ? true : false;
};

exports.removeFromListByProp = function (list, prop, item) {
  for (var x = 0; x < list.length; x++) {
    if (list[x][prop] === item) {
      list.splice(x, 1);
      return;
    }
  }
};

exports.flatten = function (array) {
  return array.reduce(function (returnArray, value) {
    returnArray = returnArray.concat(value);
    return returnArray;
  }, []);
};

exports.getFromListByProp = function (list, prop, item) {
  for (var x = 0; x < list.length; x++) {
    if (list[x][prop] === item) {
      return list[x];
    }
  }
};

exports.removeEmptyInArray = function (array) {
  for (var x = array.length - 1; x >= 0; x--) {
    if (!array[x] && typeof array[x] !== 'number') {
      array.splice(x, 1);
    }
  }
  return array;
};

exports.matchRoute = function (path, route, identifier) {
  if (route === '*') {
    return true;
  }
  var pathArray = path.split('/');
  var routeArray = route.split('/');
  this.removeEmptyInArray(pathArray);
  this.removeEmptyInArray(routeArray);
  if (pathArray.length !== routeArray.length) {
    return false;
  }
  for (var x = 0; x < pathArray.length; x++) {
    if (pathArray[x] !== routeArray[x] && !identifier(routeArray[x])) {
      return false;
    }
  }
  return true;
};

exports.getParams = function (path, route, identifier) {
  var params = {};
  var pathArray = path.split('/');
  var routeArray = route.split('/');
  routeArray.forEach(function (routePart, index) {
    if (identifier(routePart)) {
      params[routePart.replace(/\{|\}/g, '')] = pathArray[index];
    }
  });
  return params;
};

exports.compileRoute = function (path, params) {
  for (var prop in params) {
    if (params.hasOwnProperty(prop)) {
      path = path.replace('{' + prop + '}', params[prop]);
    }
  }
  return path;
};

exports.mergeTo = function (target) {
  var sources = Array.prototype.splice.call(arguments, 1, arguments.length - 1);
  sources.forEach(function (source) {
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        target[prop] = source[prop];
      }
    }
  });
  return target;
};

exports.isObject = function (obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
};

exports.deepCompare = function (a, b, except) {

  var compare = function (valueA, valueB) {
    if (Array.isArray(valueA) || exports.isObject(valueA)) {
      var isTheSame = exports.deepCompare(valueA, valueB);
      if (!isTheSame) {
        return false;
      }
    } else if (valueA !== valueB) {
      return false;
    }
    return true;
  };

  if (Array.isArray(a) && Array.isArray(b) && a !== b && a.length === b.length) {

    for (var x = 0; x < a.length; x++) {
      var isSame = compare(a[x], b[x]);
      if (!isSame) {
        return false;
      }
    }
    return true;

  } else if (exports.isObject(a) && exports.isObject(b) && a !== b) {

    // If number of properties has changed, it has changed, making them not alike
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }


    for (var prop in a) {
      if (a.hasOwnProperty(prop)) {
        var isSame = compare(a[prop], b[prop]);
        if (!isSame) {
          return false;
        }
      }
    }

    return true;

  } else {
    return false;
  }
};

exports.grabContextValue = function (context, grabber) {
  var value = context;
  var grabs = grabber.split('.');
  grabs.forEach(function (grab) {
    value = value[grab];
  });
  return value;
};

exports.createGrabObject = function (context, grabString) {
  var grabs = grabString.split('.');
  var prop = grabs.pop();
  grabs.forEach(function (grab) {
    context = context[grab];
  });
  return {
    prop: prop,
    context: context
  }
};

exports.createClassString = function (obj) {
  var classes = [];
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop) && obj[prop]) {
      classes.push(prop);
    }
  }
  return classes.join(' ');
};

exports.extractTypeAndTarget = function (event) {
  var eventArray = event.split(' ');
  return {
    type: eventArray[0],
    target: eventArray[1]
  };
};

exports.convertStyleToMap = function (styleValue) {

  var styleMap = {};
  var styles = styleValue.split(';');
  styles.forEach(function (style) {
    if (!style) {
      return;
    }
    var styleValues = style.split(':');
    styleMap[styleValues[0]] = styleValues[1].trim();
  });
  return styleMap;

}

module.exports = exports;