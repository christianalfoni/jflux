/*
 * ROUTER
 * ====================================================================================
 * Registers new routes and handles route changes
 * ====================================================================================
 */

var dom = require('./dom.js');
var utils = require('./utils.js');
var config = require('./config.js');

var exports = {};

var routes = [];

var initialRouting = true;
var previousPath = '';

exports.triggerRoute = function (route, compiledRoute, params) {
  if (typeof route.callback === 'string') {
    exports.resolveRoute(route.callback);
  } else if (config().pushState) {

    if (!initialRouting && route.path === previousPath) {
      window.history.replaceState({}, '', config().baseUrl + compiledRoute);
    } else {
      window.history.pushState({}, '', config().baseUrl + compiledRoute);
      route.callback(params);
      initialRouting = false;
    }
  } else {
    location.href = config().baseUrl + '/#' + compiledRoute;
    route.callback(params);
  }
  previousPath = route.path;
};

exports.resolveRoute = function (path) {
  for (var x = 0; x < routes.length; x++) {
    var route = routes[x];
    if (utils.matchRoute(path, route.path, utils.isParam)) {
      var params = utils.getParams(path, route.path, utils.isParam);
      return exports.triggerRoute(route, utils.compileRoute(route.path, params), params);
    }
  }
  if (routes.length) {
    throw new Error('No routes match ' + path);
  }
};

exports.route = function (path, callback) {
  if (arguments.length === 1) {
    exports.goTo(path);
  } else {
    routes.push({
      path: path,
      callback: callback
    });
  }
};

exports.goTo = function (path) {
  dom.$(function () {
    exports.resolveRoute(path);
  });
};

exports.deferTo = function (path) {
  return function () {
    exports.goTo(path);
  };
};

module.exports = exports;