var dom = require('./dom.js');
var render = require('./jflux/render.js');
var config = require('./config.js');
var path = require('./jflux/path.js');
var component = require('./component.js');
var router = require('./router.js');
var run = require('./jflux/run.js');
var action = require('./action.js');
var store = require('./store.js');
var test = require('./test.js');
var utils = require('./utils.js');
var dataStore = require('./dataStore.js');

var exports = {
    run: run,
    render: render,
    config: config,
    path: path,
    component: component,
    route: router.route,
    actions: action,
    store: store,
    test: test,
    data: function (target) {
      
      if (!target) {
        return;
      }

      if (target.originalEvent) {
        target = target.target;
      }
      var attribute = dom.$(target).attr('data-store');
      return dataStore.get.apply(dataStore, attribute ? attribute.split('_') : null);
    
    },
    fakeStore: function (exports) {
      return this.store({
        exports: exports
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
      dom.$.ajaxSetup({
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        beforeSend: function (jXhr, options) {

          if (

            options.contentType === 'application/json' &&
          // If it is POST, PUT or DELETE.
          // GET converts data properties to a query
            options.type !== 'GET' &&

            // If you are passing data
            options.data &&

            // If it is not already a string
            typeof options.data !== 'string'
            ) {

            // Stringify the data to JSON
            options.data = JSON.stringify(options.data);
          }

        }
      });
    }
  });

}

// If running in global mode, expose $$
if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.$$ = exports;
}


module.exports = exports;