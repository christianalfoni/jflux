var dom = require('./dom.js');

module.exports = function (file, stubs, test) {

  // Trick browserify/webpack to not notice these deps as they are only used in Node
  var req = require;
  var proxyquire = req('proxyquire').noPreserveCache();
  var env = req('jsdom').env;
  var html = '<html><body></body></html>';
  var getModule = function () {
    if (stubs) {
      return proxyquire(file, stubs);
    } else {
      return require(file);
    }
  };

  if (arguments.length === 2) {
    test = stubs;
    stubs = null;
  }

  file = process.cwd() + '/' + file;

  var module = getModule(file, stubs);

  // If test has no arguments, do no fire up JSDOM
  if (test.length < 2) {
    test(module);
  } else {
    env(html, function (errors, window) {

      dom.setWindow(window);


      try {
        test(module, dom.$);
      } catch (e) {
        console.log(e);
      }
      window.close();
    });
  }

};