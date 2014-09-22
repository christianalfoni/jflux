# jFlux

An easy to use unidirectional component based framework.

- [API](#api)
  - [jFlux](#jflux)
    - [$$.config](#jflux-config)
    - [$$.component](#jflux-component)
    - [$$.action](#jflux-action)
    - [$$.state](#jflux-state)
    - [$$.route](#jflux-route)
    - [$$.render](#jflux-render)
    - [$$.run](#jflux-run)
    - [$$.path](#jflux-path)
  - [Actions](#actions)
    - [Create actions](#actions-createactions)
    - [Listening to actions](#actions-listeningtoactions)
  - [State](#state)
    - [Create states](#state-createstates)
    - [State mutators](#state-statemutators)
    - [Listening to actions](#state-listeningtoactions)
    - [Exports](#state-exports)
    - [Emit](#state-emit)
  - [Components](#components)
    - [Create a component](#components-createcomponent)
    - [Compile](#components-compile)
    - [Properties](#components-properties)
    - [Map](#components-map)
    - [Attributes](#components-attributes)
      - [$$-id](#components-attributes-id)
      - [$$-class](#components-attributes-class)
      - [$$-checked](#components-attributes-checked)
      - [$$-disabled](#components-attributes-disabled)
      - [$$-value](#components-attributes-value)
      - [$$-style](#components-attributes-style)
      - [$$-href](#components-attributes-href)
      - [$$-show](#components-attributes-show)
      - [$$-data](#components-attributes-data)
    - [Composing](#components-composing)
    - [Listening to UI events](#components-listeningtouievents)
    - [Plugins](#components-plugins)
    - [Updates](#components-updates)
    - [Listening to state changes](#components-listeningtostatechanges)
    - [Binding to inputs](#components-bindingtoinputs)
  - [Router](#router)
      - [Create a route](#router-createroute)
      - [Trigger the router](#router-triggertherouter)
      - [Dynamic routes](#router-dynamicroutes)
      - [Nested routes](#router-createroute)
      - [Redirecting routes](#router-redirectingroutes)

##<a name="api">API</a>

###<a name="jflux">jFlux ($$)</a>
jFlux is available as `$$` on the global scope. It also supports common module loaders like [requirejs]() and [browserify]().

####<a name="jflux-config">$$.config(obj)</a>
Configures jFlux. The following example shows default values.
```javascript
$$.config({

    // Configures jQuery to handle all responses as JSON and all
    // request headers has: "Content-Type: application/json"
    json: true,

    // The base url of your app, f.ex. localhost:3000/todomvc would
    // need baseUrl: '/todomvc'
    baseUrl: '',

    // When popstate: false the router will use hash urls, like: /#/home, with
    // popstate: true it will use HTML5 routing, like: '/home'
    popstate: false,

    // The router will trigger on page load. If set to autoRoute: false, you
    // will have to use the $$.run() method to start the router.
    // If requirejs is detected, autoRoute defaults to false
    autoRoute: true

});
```
####<a name="jflux-action">$$.action([array])</a>
Returns a single action or a map of actions based on not passing any arguments, or passing an
array of action names. Please go to [Actions](#actions) to read more about the action API.
```javascript
var myAction = $$.action();
var myActions = $$.action([
  'action1',
  'action2',
  'action3'
]);
```

####<a name="jflux-state">$$.state(func)</a>
Returns a state object, please go to [State](#state) to read more about the state API.
```javascript
var AppState = $$.state(function () {

  var list = [];

  this.exports = {
    getList: function () {
      return list;
    }
  };

});
```

####<a name="jflux-component">$$.component(func)</a>
Returns a component. Please go to [Components](#components) to read more about the component API.
```javascript
var MyComponent = $$.component(function () {

  this.render = function (compile) {
    return compile(
      '<h1>',
        'Hello world',
      '</h1>'
    );
  };

});
```

####<a name="jflux-route">$$.route(path, func)</a>
Registers a route. Please go to [Router](#router) to read more about the route API.
```javascript
$$.route('/', function () {
  $$.render(App(), 'body');
});
```

####<a name="jflux-render">$$.render(component, target)</a>
Renders a component to the target element. The target can be any jQuery selector.
```javascript
$$.route('/', function () {
  $$.render(App(), 'body');
});
```
##### What it does
When rendering a component to a target it will check that target for any previous renders. If it finds the same component type already rendered it will update that component if the properties passed to the component has changed. If a different component is being rendered, it will remove the previous component and add the new one. If any other components has been rendered within target, they will also be removed by jFlux. If no components registered on the target it will of course just render.

####<a name="jflux-run">$$.run()</a>
Normally you do not need to run this method. It will run automatically on page load. If you have configured `autoRoute:false`, or use [requirejs](), you will ned to run the method. It triggers the router and handling of url changes and components.
```javascript
$$.route('/', function () {});
// More routes
$$.run();
```
##### What it does

1. Register a delegated listener to all `<a/>` elements. When clicked it will use the `href` attribute value to resolve a route and trigger it.

2. Triggers the initial route based on current url

####<a name="jflux-path">$$.path()</a>
Returns the current route path.
```javascript
$$.path() // f.ex. "/posts/1"
```

###<a name="actions">Actions</a>
Actions defines what state changes your application is able to do. Reading the list of actions
is actually reading the functionality of your application.

####<a name="actions-createactions">Create actions</a>
```javascript
// Returns a function that will trigger the action when called
var addTodo = $$.action();

// Trigger action with any number of arguments
addTodo({title: 'foo'});

// Create a map of actions
var actions = $$.action([
  'addTodo',
  'removeTodo',
  'editTodo'
]);
actions.addTodo({title: 'foo'});
actions.removeTodo(todo);
actions.editTodo(todo, 'newTitle');
```

####<a name="actions-listeningtoactions">Listening to actions</a>
Only states created will be able to listen to actions, do state changes and
flush updates to listening components.
```javascript
var AppState = $$.state(function () {

  // A state
  var todos = [];

  // A state mutator
  this.addTodo = function (todo) {
    todos.push(todo);
    this.flush();
  };

  // Listen to an action
  this.listenTo(actions.addTodo, this.addTodo);

  // Export methods that components can use to get
  // state information
  this.exports = {
    getTodos: function () {
      return todos;
    }
  };

});
```

### <a name="state">State</a>
State objects holds state of your application. You may only have on "AppState" object or
multiple state objects that will handle different types of state in your application.

####<a name="state-creatingstates">Creating states</a>
Your state is contained inside one or multiple state objects. The states are
normally defined by declaring a variable.
```javascript
var AppState = $$.state(function () {

  // A todos list state
  var todos = [];

  // A filter state
  var filter = {
    completed: true,
    active: true
  };

});
```

####<a name="state-statemutators">State mutators</a>
State mutators are normally triggered by an action listener and will change
declared variables.
```javascript
var AppState = $$.state(function () {

  var todos = [];
  var filter = {
    completed: true,
    active: true
  };

  // The mutator use data passed to mutate
  // a state. Then it flushes to inform
  // listening components about the update
  this.addTodo = function (todo) {
    todos.push(todo);
    this.flush();
  };


  this.filter = function (filterOptions) {
    filter = filterOptions;
    this.flush();
  };

});
```

####<a name="state-flush">Flush</a>
Run the flush method to notify components about an update.
```javascript
var AppState = $$.state(function () {

  var todos = [];
  var filter = {
    completed: true,
    active: true
  };

  this.addTodo = function (todo) {
    todos.push(todo);
    this.flush(); // Notify all listening components about an update
  };


  this.filter = function (filterOptions) {
    filter = filterOptions;
    this.flush(); // Notify all listening components about an update
  };


});
```

####<a name="state-listeningtoactions">Listening to actions</a>
A state object in jFlux listens to actions and trigger their
state mutators.
```javascript
var AppState = $$.state(function () {

  var todos = [];
  var filter = {
    completed: true,
    active: true
  };

  this.addTodo = function (todo) {
    todos.push(todo);
    this.flush();
  };

  this.filter = function (filterOptions) {
    filter = filterOptions;
    this.flush();
  };

  // Listen to the function that is used to trigger
  // the action
  this.listenTo(actions.addTodo, this.addTodo);
  this.listenTo(actions.filter, this.filter);

});
```

####<a name="state-exports">Exports</a>
Components will need to extract the states from the state object. This is done
by defining export methods. These methods should only be "getters", not "setters".
State change is only done by actions.
```javascript
var AppState = $$.state(function () {

  var todos = [];
  var filter = {
    completed: true,
    active: true
  };

  this.addTodo = function (todo) {
    todos.push(todo);
    this.flush();
  };

  this.filter = function (filterOptions) {
    filter = filterOptions;
    this.flush();
  };

  this.listenTo(actions.addTodo, this.addTodo);
  this.listenTo(actions.filter, this.filter);

  // We define a method that will be available to components.
  // It returns a list of todos based on the current state of
  // the filter
  this.exports = {
    getTodos: function () {
      return todos.filter(function (todo) {
        return (filter.completed && todo.completed) || (filter.active && !todo.completed);
      });
    }
  };

});
```

####<a name="state-emit">Emit</a>
There might be situations where you want to notify components about a specific state change. That is useful for state
 updates that happens very often. Look at [Listening to state changes](#components-listeningtostatechanges), for more
  information.
```javascript
var AppState = $$.state(function () {

  var duration = 0;

  var state = this;
  setInterval(function () {
    duration += 100;
    state.emit('duration:update');
  }, 100);

  this.exports = {
    getDuration: function () {
      return duration;
    }
  };

});
```

###<a name="jflux-components">Components</a>
All your UI is constructed with components. They are composable, meaning that components
can live inside other components.

####<a name="components-creatingacomponent">Creating a component</a>
The minimum boilerplate for a component is to define a render callback that
returns a DOM representation with a top node. The default render method compiles a single `div`.
```javascript
var MyComponent = $$.component(function () {

  this.render = function (compile) {
    return compile(
      '<h1>',
        'Hello world',
      '</h1>'
    );
  };

});
```

####<a name="components-compile">Compile</a>
The first and only argument passed to a components render method is the `compile` function. The compile function
returns a UI data structure that jFlux understands. Compile can take the following arguments:

- string
- number
- array of templates
- Component

The arguments builds a DOM structure that will be appended to wherever the component
is appended or diffed with existing render of the component.

####<a name="components-properties">Properties</a>
Components can receive properties. These properties are passed when a component is rendered to an existing DOM node, or when composed into an other component. The properties are an object that can take any values. You point to the passed properties with: `this.props`.

```javascript
var MyComponent = $$.component(function () {

  this.render = function (compile) {
    return compile(
      '<h1>',
        this.props.title,
      '</h1>'
    );
  };

});

$$.render(MyComponent({title: 'Hello world!'}), 'body');
```

####<a name="components-map">Map</a>
If you need to compile a list of elements you can use the `map` method provided. It takes its own compile function.
The context of the map callback will be unique. You can use that context to add "render-props", point to the item
in the current iteration and the "props" passed to the component itself.
```javascript
var MyComponent = $$.component(function () {

  this.compileList = function (compile) {
    return compile(
      '<li>',
        this.item,
      '</li>'
    );
  };

  this.render = function (compile) {
    var list = this.map(['foo', 'bar'], this.compileList);
    return compile(
      '<ul>',
        list,
      '</ul>'
    );
  };

});
```

####<a name="components-attributes">Attributes</a>
You can add attributes as you normally would, but jFlux is aware of the context you are in an can get values from that context.
You have your main component context, where you define render etc., but you also have a context when iterating lists which you
can grab values from. In a list the item iterated over is the property "item". You also have access to "props". The
rest of the context you can use to add yourn own "render props".

```javascript
var MyComponent = $$.component(function () {
  this.myList = [{id: '1', title: 'foo'}, {id: '2', title: 'bar'}];
  this.compileList = function (compile) {
    return compile(
      '<div $$-id="item.id">' + this.item.title + '</div>'
    );
  };
  this.render = function (compile) {

    // In context of a list
    var list = this.map(this.myList, this.compileList);

    // In context of the render method
    this.myId = 'myId';
    return compile(
      '<div $$-id="myId"></div>'
    );
  };

});
``

#####<a name="components-attributes-id">$$-id</a>
```javascript
var MyComponent = $$.component(function () {

  this.render = function (compile) {
    this.myId = 'myId';
    return compile(
      '<ul $$-id="myId">',
        list,
      '</ul>'
    );
  };

});
```
#####<a name="components-attributes-class">$$-class</a>
The class attribute needs to point to an object where the keys are the class names and the value is either true or false. True values will add the class name, false will not.
```javascript
var MyComponent = $$.component(function () {

  this.render = function (compile) {

    this.myListClass = {
      active: $$.path() === '/',
      'my-list-class': true
    };

    return compile(
      '<ul $$-class="myListClass">',
        list,
      '</ul>'
    );
  };

});
```
#####<a name="components-attributes-checked">$$-checked</a>
```javascript
var MyComponent = $$.component(function () {

  this.render = function (compile) {
    this.isActive = true;
    return compile(
      '<input type="checkbox" $$-checked="isActive"/>'
    );
  };

});
```
#####<a name="components-attributes-disabled">$$-disabled</a>
```javascript
var MyComponent = $$.component(function () {

  this.render = function (compile) {
    this.isDisabled = false;
    return compile(
      '<input type="checkbox" $$-disabled="isDisabled"/>'
    );
  };

});
```
#####<a name="components-attributes-value">$$-value</a>
```javascript
var MyComponent = $$.component(function () {

  this.render = function (compile) {
    this.myValue = 'Hello there';
    return compile(
      '<input type="text" $$-value="myValue"/>'
    );
  };

});
```

#####<a name="components-attributes-style">$$-style</a>
```javascript
var MyComponent = $$.component(function () {

  this.render = function (compile) {
    this.myStyle = {
      color: 'red'
    };
    return compile(
      '<div $$-style="myStyle"/>'
    );
  };

});
```

#####<a name="components-attributes-href">$$-href</a>
```javascript
var MyComponent = $$.component(function () {

  this.render = function (compile) {
    this.url = 'http://www.jflux.io';
    return compile(
      '<a $$-href="url"/>'
    );
  };

});
```

#####<a name="components-attributes-show">$$-show</a>
```javascript
var MyComponent = $$.component(function () {

  this.render = function (compile) {
    this.isReady = true;
    return compile(
      '<div $$-show="isReady"></div>'
    );
  };

});
```

#####<a name="components-attributes-data">$$-data</a>
```javascript
var MyComponent = $$.component(function () {

  this.onClick = function (data) {
    console.log(data.foo); // "bar"
  };

  this.listenTo('click', this.onClick);
  this.render = function (compile) {
    this.someData = {
      foo: 'bar'
    };
    return compile(
      '<div $$-data="someData"></div>'
    );
  };

});
```

####<a name="components-composing">Composing</a>
A component DOM representation can take other components as arguments.

```javascript
var Item = $$.component(function () {
  this.render = function (compile) {
    return compile(
      '<li>',
        this.props.label,
      '</li>'
    );
  };
});
var List = $$.component(function () {
  this.compileItems = function (compile) {
    return compile(
      Item({label: this})
    );
  };
  this.render = function (compile) {
    var items = this.map(['foo', 'bar'], this.compileItems);
    return compile(
      '<ul>',
        Item({label: 'First in list'}),
        items,
      '</ul>'
    );
  };
});
```

####<a name="components-listeningtouievents">Listening to UI events</a>
Since jFlux is based on jQuery you will be able to use delegated events
in your component to listen for user interaction.

```javascript
var MyComponent = $$.component(function () {
  this.log = function () {
    console.log('I was clicked!');
  };

  // The top node is what we are listening to, so no need to
  // set a target
  this.listenTo('click', this.log);
  this.render = function (compile) {
    return compile(
      '<button>',
        'Click me!',
      '</button>'
    );
  };
});
```

If the node you listen to is nested in the DOM representation, use delegation:

```javascript
var MyComponent = $$.component(function () {
  this.log = function () {
    console.log('I was clicked!');
  };

  // The second argument can be any jQuery selector
  this.listenTo('click', 'button', this.log);
  this.render = function (compile) {
    return compile(
      '<div>',
        '<button>',
          'Click me!',
        '</button>',
      '</div>'
    );
  };
});
```

####<a name="components-plugins">Plugins</a>
You can use any and multiple jQuery plugins in your component. This makes components increadibly
powerful as there already are lots of plugins out there.

```javascript
var MyComponent = $$.component(function () {

  // First argument is the name of the plugin, f.ex. $('a').dropdown() will be
  // 'dropdown'. The second argument is only needed if the plugin is triggered
  // on a nested element in the DOM representation. The last argument are the options passed
  // to the plugin
  this.plugin('someJQueryPlugin', 'span', {someOption: 'someValue'});
  this.render = function (compile) {
    return compile(
      '<div>',
        '<span></span>',
      '</div>'
    );
  };
});
```

####<a name="components-updates">Updates</a>
Components are very smart when updating. They will do a diff of the jFlux UI structure and only do necessary DOM operations to update the UI. This includes attributes, text nodes and lists. You can call `this.update()` at any time, though they are normally used with state updates.

```javascript
var MyComponent = $$.component(function () {

  this.style = {
    color: 'red'
  };

  this.changeColor = function () {
    this.style.color = this.style.color === 'red' ? 'blue' : 'red';
    this.update();
  };

  this.listenTo('click', 'button', this.changeColor);
  this.render = function (compile) {
    return compile(
      '<div $$-style="style">',
        '<button>Change color</button>',
      '</div>'
    );
  };
});
```

####<a name="components-listeningtostatechanges">Listening to state changes</a>
Components listens to state changes on state objects. They do this by using the `listenTo` method also used to listen for UI interaction. When the state object flushes the component will rerender itself.

```javascript
var MyComponent = $$.component(function () {
  this.listenTo(AppState, this.update);
  this.render = function (compile) {
    return compile(
      '<h1>',
        AppState.getTitle(),
      '</h1>'
    );
  };
});
```

You can also listen to specific events emitted from a state. This is useful when you need to notify a component very
often and do not want to flush out to the whole application:

```javascript
var MyComponent = $$.component(function () {
  this.listenTo('duration:update', AppState, this.update);
  this.render = function (compile) {
    return compile(
      '<h1>',
        AppState.getDuration(),
      '</h1>'
    );
  };
});
```

####<a name="components-bindingtoinputs">Binding to inputs</a>
Sometimes you want to bind to inputs. The inputs might affect a state in your component and you need it to update automatically. Meet bind, it will update your component on
input change:

```javascript
var MyComponent = $$.component(function () {
  var todo = {
    title: '',
    description: ''
  };
  this.bind(model, 'title', 'input[name="title"]');
  this.bind(model, 'description', 'input[name="description"]');
  this.render = function (compile) {
    this.invalidTodo = !(todo.title && todo.description);
    return compile(
      '<div>',
        '<input name="title" type="text"/>',
        '<input name="description" type="text"/>',
        '<button $$-disabled="invalidTodo">',
          'Add',
        '</button>',
      '</div>'
    );
  };
});
```
The button in this example will only be enabled if there is both a title and a description.

##<a name="router">Router</a>
jFlux supports both hash and popstate routing. jFlux knows about its rendered components and lets you very easily render components to any section of the screen, much like nested routes. It also supports dynamic links and redirects.

####<a name="router-createroute">Creating a route</a>

```javascript
$$.route('/', function () {
  $$.render(MyComponent(), 'body');
});
$$.route('/account', function () {
  $$.render(MyAccountComponent(), 'body');
});
```
There is one special route `*`, which triggers on any url. This should be added last, as a fallback.

```javascript
$$.route('/', function () {
  $$.render(MyComponent(), 'body');
});
$$.route('*', function () {
  $$.render(MyRouteError(), 'body');
});
```

####<a name="router-triggertherouter">Trigger the router</a>
By default the router will trigger itself on page load. You can configure this behaviour with the [config](#jflux-config) method. You might need to download some resources before triggering the router or you might be using *requirejs*. In that case you will have to trigger the router manually. This is an example with requirejs:
```javascript
require(['jflux', 'MyApp'], function ($$, MyApp) {
  $$.route('/', function () {
    $$.render(MyApp(), 'body');
  });
  $$.run();
});
```

####<a name="router-dynamicroutes">Dynamic routes</a>
```javascript
$$.route('/posts/{id}', function (params) {
  $$.render(Post(params), 'body');
});
$$.route('/posts/{id}/{action}', function (params) {
  $$.render(Post(params), 'body');
});
```
In the first route above params will be an object that contains a key of `id`. The value of the key is whatever was written in the url in the `{id}` section. You can add multiple dynamic sections to the url, like shown in the next example, where you also have `{action}`. The params object passed to the callback will have two keys, `id` and `action`, with their respective values.

####<a name="router-nestedroutes">Nested routes</a>
Instead of defining nesting in your code, like with callbacks etc. jFlux takes a different approach. Since it has full control of components in your page you do not have to worry about overriding or unecessarily rerendering them. That means we can define how the page should look on each route and jFlux will update the current DOM to that state as effectively as possible.
```javascript
$$.route('/', function () {
  $$.render(App(), 'body');
});
$$.route('/posts', function () {
  $$.render(App(), 'body');
  $$.render(Posts(), '#posts');
});
$$.route('/posts/{id}', function (params) {
  $$.render(App(), 'body');
  $$.render(Posts(), '#posts'); // #posts exists inside App() DOM structure
  $$.render(Post(params), '#post'); // #post exists inside Post() DOM structure
});
```
This gives you a lot more freedom in rendering your page on route changes. You could f.ex. render different components based on different states, or maybe based on the user logged in, not render certain components etc.

####<a name="router-redirectingroutes">Redirecting routes</a>
```javascript
$$.route('/', function () {
  $$.render(App(), 'body');
});
$$.route('*', '/');
```
Pass a string of an other route definition to redirect. In this example all routes that do not match `/`, is also redirected to `/`.
