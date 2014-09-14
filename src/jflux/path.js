/*
 * PATH
 * ====================================================================================
 * Returns the current route path
 * ====================================================================================
 */
var config = require('./../config.js');
var path = function () {

  return config().pushState ?

    // Return the pathname without baseUrl
    location.pathname.substr(config().baseUrl.length) :

    // Return the hash, without the #
    location.hash.substr(1);

};

module.exports = path;