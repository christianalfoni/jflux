# jFlux

An easy to use unidirectional component based framework.

WebSite: [www.jflux.io](http://www.jflux.io)

### Testing the examples
Clone the repo and run `python -m SimpleHTTPServer 3000` in your terminal at the root of this repo, then access f.ex.
`localhost:3000/demo-todomvc`.

### The background
Please read the following post if you are interested in the background of this project: [jQuery as a framework, could that work?](http://christianalfoni.github.io/javascript/2014/09/08/jquery-as-a-framework-could-that-work.html)

### Change log

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

### Contribute
Coming soon...