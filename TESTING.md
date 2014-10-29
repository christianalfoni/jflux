# jFlux testing

jFlux exposes an easy to use test method that supports stubbing of dependencies. It will also pass an isolated jQuery
 instance for DOM related testing. The tests are run in Node with jQuery and JSDOM.

**Beware**, all tests run async, which means you have to use done() to notify that tests are done.

### A simple test
```javascript
var $$ = require('jflux');

describe("Toggler()", function () {
  it("should be checked on button click", function (done) {

    // Test takes a file relative to your project path.
    // The module will be passed as the first arugment in the callback
    // and an isolated jQuery instance as the second argument
    $$.test('app/Toggler.js', function (Toggler, $) {

      // Use jFlux as you normally would
      $$.render(Toggler(), 'body');

      // Use jQuery as you normally would
      $('button').click();

      // Write tests using jQuery
      expect($(':checkbox').is(':checked')).toBe(true);
      done();
    });

  });

});
```

### Stubbing
You can stub required modules of the module you are testing. Read more about [proxyquire](https://github
.com/thlorenz/proxyquire).
```javascript
var $$ = require('jflux');

describe("Toggler()", function () {
  it("should be checked on button click", function (done) {

    // If the second argument is an object, the keys of that
    // object can be required modules. In this example Toggler.js
    // has the following require decleration: var utils = require('./utils.js');
    // The value of the key is the exposed object, or function, that you can
    // override
    $$.test('app/Toggler.js', {
      './utils.js': {
        convertSomething: function () {
          return 'foo';
        }
      }
    }, function (Toggler, $) {

      $$.render(Toggler(), 'body');
      expect($(':checkbox').is(':checked')).toBe(true);
      done();
    });

  });

});
```

### Faking stores
If you need to fake the exports of a store, use the $$.fakeStore method. You have to do this due
to the object being returned has an EventEmitter as prototype.
```javascript
var $$ = require('jflux');

describe("Toggler()", function () {
  it("should be checked on button click", function (done) {

    // If the second argument is an object, the keys of that
    // object can be required modules. In this example Toggler.js
    // has the following require decleration: var utils = require('./utils.js');
    // The value of the key is the exposed object, or function, that you can
    // override
    $$.test('app/Toggler.js', {
      './AppStore.js': $$.fakeStore({
        isChecked: function () {
          return true;
        }
      })
    }, function (Toggler, $) {

      $$.render(Toggler(), 'body');
      expect($(':checkbox').is(':checked')).toBe(true);
      done();
    });

  });

});
```