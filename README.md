# jFlux

An easy to use unidirectional component based framework.

WebSite: [www.jflux.io](http://www.jflux.io)
Documentation: [DOCUMENTATION.md](https://github.com/christianalfoni/jflux/blob/master/DOCUMENTATION.md)
Testing: [TESTING.md](https://github.com/christianalfoni/jflux/blob/master/TESTING.md)

### Testing the examples
Clone the repo and run `python -m SimpleHTTPServer 3000` in your terminal at the root of this repo, then access f.ex.
`localhost:3000/demo-todomvc`.

### The background
Please read the following post if you are interested in the background of this project: [jQuery as a framework, could that work?](http://christianalfoni.github.io/javascript/2014/09/08/jquery-as-a-framework-could-that-work.html)

### Contribute
jFlux is currently being used to build the BETA of [www.jsfridge.com](http://www.jsfridge.com). It is a complex web
application that will challenge jFlux and its capabilities. Currently this is running a long quite nicely and the API
is starting to come together. What jFlux now needs is **error messages** and **tests**.

#### Error messages
jFlux has a module that produces error messages. Import that module and pass an error in the following format:

```javascript
var error = require('./error.js');
error.create({
  source: myVar,
  message: 'Could not render component',
  support: 'Verify that you pass an object',
  url: 'https://github.com/christianalfoni/jflux/blob/master/DOCUMENTATION.md#jflux-render'
});
```

This will throw an error and produce an error string like this: *"undefined gave an error. Could not render Component
. Verify that you pass an object. More documentation at: https://github
.com/christianalfoni/jflux/blob/master/DOCUMENTATION.md#jflux-render"*.

#### Tests
There are two types of tests you can create for jFlux. **Unit** tests and **Framework** tests. Unit tests test
individual modules and methods inside the framework. Framework tests loads the whole framework and is used to create
"live scenarios" with expected results using the $$.test method.

##### Running the tests
Use **gulp test** from the project root to start the tests. Add new tests to the `./specs` folder with "name"-spec.js
 as filename.

##### Unit test
```javascript
var utils = require('./../src/utils.js');

describe("isParam()", function () {
  it("should return true when text is a param in format of {something}", function () {
    expect(utils.isParam('{something}')).toBe(true);
    expect(utils.isParam('something')).toBe(false);
    expect(utils.isParam('{something')).toBe(false);
    expect(utils.isParam('something}')).toBe(false);
    expect(utils.isParam('so{me}')).toBe(false);
  });
});
```
##### Framework test
```javascript
var $$ = require('./../src/jflux.js');

describe("isParam()", function () {
  it("should create a component", function (done) {

    $$.test(function ($) {

      var Comp = $$.component(function () {
        this.render = function (compile) {
          return compile(
            '<div>Hello world</div>'
          );
        };
      });

      $$.render(Comp(), 'body');

      expect($('div').text()).toBe('Hello world');
      done();

    });

  });
});
```
Please contact me for further guidance.

### Change log

**0.8.0**
- Welcome to contribute!
- Changed test method signature to allow for internal testing
- Added test examples
- Added error tool

**0.7.6**
- Fixed replacing components and cleaning up
- Added check for content-type JSON before stringifying data to server
- Added teardown method that runs when component is removed
- Fixed bug with $$-data

**0.7.5**
- Small bug fix

**0.7.4**
- Small bug with $$-data... time to get some tests soon ;-)
- Bug with state listener

**0.7.3**
- Added afterRender method to components
- Fixed utils bug
- Updated demos

**0.7.2**
- Fixed list diff bug
- Added $$-data to pass objects to listeners
- Trigger events from states with this.emit
- Listen to specific events from states
- Automatically add index as ID lookup, when no ID defined in map

**0.7.1**
- Added $$-show
- Added this.index to the context of the this.map callback
- Fixed state listener leak
- Fixed prop change check

**0.7.0**
- Fixed jQuery AJAX json configuration
- Added $$.route('/') to go to path manually
- Optimized compiling
- Fixed bug with handling components in lists

**0.6.1**
First change log tracking version
