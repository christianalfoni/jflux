**0.9.4**
- Fixed diff bug on $$-data

**0.9.3**
- Fixed diff bug

**0.9.2**
- Fixed list update bug
- Fixed compare bug
- Added possibility to transclude HTML in components
- Changed $$.fakeState to $$.fakeStore (testing)

**0.9.1**
- Fixed check of "preventDefault" on URL trigger
- Fixed route comparison
- Added $$-hide
- Fixed routing "back" bug
- Fixed handling of input tag
- Fixed handling of NULL and UNDEFINED to compile

**0.9.0**
- Revamped the API to make it feel more like Backbone JS
- Optimized removal of components
- Improved bindings
- Added immutable method
- Changed STATE to STORE
- Changed exports object to return object instead
- Removed flush, just use emit

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