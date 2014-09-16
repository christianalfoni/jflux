var dom = require('./dom.js');
var render = require('./jflux/render.js');
var generateId = require('./jflux/generateId.js');
var config = require('./config.js');
var path = require('./jflux/path.js');
var component = require('./component.js');
var router = require('./router.js');
var run = require('./jflux/run.js');
var action = require('./action.js');
var state = require('./state.js');
var test = require('./test.js');

var exports = {
    run: run,
    render: render,
    generateId: generateId,
    config: config,
    path: path,
    component: component,
    route: router.route,
    action: action,
    state: state,
    test: test,
    fakeState: function (exports) {
      return this.state(function () {
        this.exports = exports;
      });
    }
};

// If not running in Node
if (typeof window !== 'undefined') {

  dom.$(function () {
    if (!global.define && config().autoRun) {
      exports.run();
    }
    if (config().json) {
      $.ajaxSetup({
        contentType: 'application/json',
        dataType: 'json'
      });
    }
  });

}

// If running in global mode, expose $$
if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.$$ = exports;
}


module.exports = exports;