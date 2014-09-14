var $ = global.jQuery || require('jquery');
var render = require('./jflux/render.js');
var generateId = require('./jflux/generateId.js');
var config = require('./config.js');
var path = require('./jflux/path.js');
var component = require('./component.js');
var router = require('./router.js');
var run = require('./jflux/run.js');
var action = require('./action.js');
var state = require('./state.js');

var exports = {
    run: run,
    render: render,
    generateId: generateId,
    config: config,
    path: path,
    component: component,
    route: router.route,
    action: action,
    state: state
};

$(function () {
    if (!window.define && config().autoRun) {
        exports.run();
    }
    if (config().json) {
        $.ajaxSetup({
            contentType: 'application/json',
            dataType: 'json'
        });
    }
});

// If running in global mode, expose $$
if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.$$ = exports;
}


module.exports = exports;