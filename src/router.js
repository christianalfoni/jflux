/*
 * ROUTER
 * ====================================================================================
 * Registers new routes and handles route changes
 * ====================================================================================
 */

var $ = global.jQuery || require('jquery');
var utils = require('./utils.js');
var config = require('./config.js');

var exports = {};

var routes = [];

var initialRouting = true;

exports.triggerRoute = function (route, compiledRoute, params) {
    if (typeof route.callback === 'string') {
        exports.resolveRoute(route.callback);
    } else if (config().pushState) {
        if (!initialRouting && route.path === location.pathname) {
            window.history.replaceState({}, '', compiledRoute);
        } else {
            window.history.pushState({}, '', compiledRoute);
            route.callback(params);
            initialRouting = false;
        }
    } else {
      location.href = config().baseUrl + '/#' + compiledRoute;
      route.callback(params);
    }
};

exports.resolveRoute = function (path) {
    for (var x = 0; x < routes.length; x++) {
        var route = routes[x];
        if (utils.matchRoute(path, route.path, utils.isParam)) {
            var params = utils.getParams(path, route.path, utils.isParam);
            return exports.triggerRoute(route, utils.compileRoute(route.path, params), params);
        }
    }
    throw new Error('No routes match ' + path);
};

exports.route = function (path, callback) {
    if (arguments.length !== 2) {
        throw new Error('You are passing the wrong arguments to createRoute()');
    }
    routes.push({
        path: config().pushState ? config().baseUrl + path : path,
        callback: callback
    });
};

exports.goTo = function (path) {
    $(function () {
        exports.resolveRoute(config().pushState ? config().baseUrl + path : path);
    });
};

exports.deferTo = function (path) {
    return function () {
        exports.goTo(path);
    };
};

module.exports = exports;