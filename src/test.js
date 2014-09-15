var dom = require('./dom.js');

module.exports = function (file, stubs, test) {

  var proxyquire = require('proxyquire').noPreserveCache();
  var env = require('jsdom').env;
  var html = '<html><body></body></html>';

  if (arguments.length === 2) {
    test = stubs;
    stubs = null;
  }

  file = process.cwd() + '/' + file;

  env(html, function (errors, window) {

    dom.setWindow(window);
    var module;

    if (stubs) {
      module = proxyquire(file, stubs);
    } else {
      module = require(file);
    }
    try {
      test(module, dom.$);
    } catch (e) {
      console.log(e);
    }
    window.close();
  });

};