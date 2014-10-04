/*
 * CONFIG
 * ====================================================================================
 * Holds default config
 * ====================================================================================
 */
var utils = require('./utils.js');
var _options = {

    // jFlux will add application/json to request headers and parse
    // responses to JSON
    json: true,

    // If the application lives at /somePath, jFlux needs to know about it
    baseUrl: '',

    // Activates HTML5 pushState instead of HASH
    pushState: false,

    // Tells jFlux to run the $$.run method automatically, which routes to
    // current path
    autoRun: true

};

var config = function (options) {
    if (!options) {
        return _options;
    } else {
        utils.mergeTo(_options, options);
    }
};

module.exports = config;