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

jFlux is being used to build [www.jsfridge.com](http://www.jsfridge.com). It is a complex web
application that has challenged jFlux and its capabilities.

### Contribute
If you want to contribute to jFlux it does need testing. Please follow this discription to create tests.

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

**1.1.1**
- Due to jQuery caching data attributes there has been a change to the data-API. Still use $$-data to attach data to nodes, but use $$.data(event/node) to grab that data. Good thing is that it now references the same object/array

**1.1.0**
- Implemented virtual-dom. It is not as fast as React JS (80-90% in initial testing) due to how jFlux allows for normal javascript syntax to build a DOM representation and integrates with jQuery. It will normally update faster when changing state of parent components as child components will not get affected unless properties passed has changed. To sum it up, jFlux has become crazy faster!

**1.0.1**
- Do not deepCopy ArrayBuffers and Blobs

**1.0.0**
- Changes syntax of stores to reflect [flux-react](https://github.com/christianalfoni/flux-react) and [flux-angular](https://github.com/christianalfoni/flux-angular)
- Changed $$.action to $$.actions, since you always want to define multiple actions
- Removed $$.immutable, this is automatically done on all exports and action calls
- Support circular deps when cloning
- Binding does not update the component, listen to $$-change event to update the component on binding updates (performance)
- Fixed back button on hash urls

[Earlier changes](https://github.com/christianalfoni/jflux/blob/master/CHANGES.md)
