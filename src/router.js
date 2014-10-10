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
var previousRoute = '';

exports.triggerRoute = function (route, compiledRoute, params, replaceState) {

  if (typeof route.callback === 'string') {

    exports.resolveRoute(utils.compileRoute(route.callback, params));

  } else if (config().pushState) {

    if (!initialRouting && previousRoute !== compiledRoute) {
      window.history[replaceState ? 'replaceState' : 'pushState']({}, '', config().baseUrl + compiledRoute);
    }
    initialRouting = false;
    route.callback(params);

  } else {
    location.href = config().baseUrl + '/#' + compiledRoute;
    route.callback(params);
  }
  previousRoute = compiledRoute;
};

exports.resolveRoute = function (path, replaceState) {
  for (var x = 0; x < routes.length; x++) {
    var route = routes[x];
    if (utils.matchRoute(path, route.path, utils.isParam)) {
      var params = utils.getParams(path, route.path, utils.isParam);
      return exports.triggerRoute(route, utils.compileRoute(route.path, params), params, replaceState);
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

exports.goBack = function (path) {
  exports.resolveRoute(path, true);
};

exports.deferTo = function (path) {
  return function () {
    exports.goTo(path);
  };
};

module.exports = exports;