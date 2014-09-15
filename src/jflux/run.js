/*
 * RUN
 * ====================================================================================
 * Registers hyperlink handling and triggers the router. This runs automatically
 * on page load, unless using requirejs or "autoRun" in the config is set to false
 * ====================================================================================
 */

var dom = require('./../dom.js');
var router = require('./../router.js');
var config = require('./../config.js');

var run = function () {

  // Any links triggered, intercept and use router instead, passing
  // the path
  dom.$('body').on('click', 'a', function (event) {

    // Only grab it if there is no target attribute
    if (!event.currentTarget.getAttribute('target')) {
      event.preventDefault();

      // We have to turn off the onhashchange trigger to avoid triggering the route
      // again, and at the same time allow for back/forward buttons
      var hashchange = window.onhashchange;
      window.onhashchange = null;

      // href is full url, so to get the path we need to remove the origin and any
      // baseUrl
      var path = event.currentTarget.href.substr(location.origin.length);
      router.goTo(path);

      // Put hash listening back into the event loop
      setTimeout(function () {
        window.onhashchange = hashchange;
      }, 0);
    }
  });

  if (config().pushState) {
    window.onpopstate = function () {
      router.resolveRoute(location.pathname);
    };
  } else {
    window.onhashchange = function () {
      console.log('hmmm', location.hash);
      router.goTo(location.hash.substr(1));
    };
  }

  // Initial routing passing current pathname without baseUrl
  var path = location.pathname.substr(config().baseUrl.length);
  router.goTo(path);

};

module.exports = run;