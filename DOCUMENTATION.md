# jFlux

An easy to use unidirectional component based framework.

You can read more about **testing** here: [TESTING.md](https://github.com/christianalfoni/jflux/blob/master/TESTING.md)

- [API](#api)
  - [jFlux](#jflux)
    - [$$.config](#jflux-config)
    - [$$.component](#jflux-component)
    - [$$.actions](#jflux-actions)
    - [$$.store](#jflux-store)
    - [$$.route](#jflux-route)
    - [$$.render](#jflux-render)
    - [$$.run](#jflux-run)
    - [$$.path](#jflux-path)
    - [$$.data](#jflux-data)
  - [Actions](#actions)
    - [Create actions](#actions-createactions)
  - [Store](#store)
    - [Create states](#store-createstates)
    - [Listening to actions](#store-listeningtoactions)
    - [State handler](#store-statehandlers)
    - [Emit change](#store-emitchange)
    - [Emit](#store-emit)
    - [Exports](#store-exports)
  - [Components](#components)
    - [Create a component](#components-createacomponent)
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
    - [Transclusion](#components-transclusion)
    - [Listening to UI events](#components-listeningtouievents)
    - [Plugins](#components-plugins)
    - [Updates](#components-updates)
    - [Listening to state changes](#components-listeningtostatechanges)
    - [Binding to inputs](#components-bindingtoinputs)
    - [After render](#components-afterrender)
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

    // When pushState: false the router will use hash urls, like: /#/home, with
    // pushState: true it will use HTML5 routing, like: '/home'
    pushState: false,

    // The router will trigger on page load. If set to autoRoute: false, you
    // will have to use the $$.run() method to start the router.
    // If requirejs is detected, autoRoute defaults to false
    autoRoute: true

});
```
####<a name="jflux-actions">$$.actions([string])</a>
Returns a map of actions. Please go to [Actions](#actions) to read more about the action API.
```javascript
var myActions = $$.actions([
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

  return {
    getList: function () {
      return $$.immutable(list);
    }
  };

});
```

####<a name="jflux-component">$$.component(func)</a>
Returns a component. Please go to [Components](#components) to read more about the component API.
```javascript
var MyComponent = $$.component({

  render: function (compile) {
    return compile(
      '<h1>',
        'Hello world',
      '</h1>'
    );
  }

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

####<a name="jflux-data">$$.data()</a>
Grabs any data attached on the target of the event or the target node itself. Look at [$$-data](#components-attributes-data) for more information and example.
```javascript
$$.data(event/target)
```

####<a name="jflux-immutable">$$.immutable()</a>
Returns a deep cloned version of the array or object passed
```javascript
$$.immutable([{id: 1, title: 'foo'}]);
```

###<a name="actions">Actions</a>
Actions defines what state changes your application is able to do. Reading the list of actions
is actually reading the functionality of your application.

####<a name="actions-createactions">Create actions</a>
```javascript
// Create a map of actions
var actions = $$.actions([
  'addTodo',
  'filter'
]);
actions.addTodo({title: 'foo'});
actions.filter({
  completed: true,
  active: true
});
```

### <a name="store">Store</a>
Store objects holds state of your application. You may only have on "AppStore" object or
multiple store objects that will handle different types of state in your application.

####<a name="store-creatingstates">Creating stores</a>
Your state is contained inside one or multiple store objects. The states are defined
as properties of a store.
```javascript
var AppStore = $$.store({
  todos: [],
  filter: {
    completed: true,
    active: true
  }
});
```

####<a name="store-listeningtoactions">Listening to actions</a>
A store in jFlux can listen to actions and trigger their state handlers. The name of an action maps directly to a handler with the same name, as you can see on next example.
```javascript
var AppStore = $$.store({
  todos: [],
  filter: {
    completed: true,
    active: true
  },
  actions: [
    actions.addTodo,
    actions.filter
  ]
});
```

####<a name="store-statehandlers">State handlers</a>
State handlers are normally triggered by an action and will change
declared state properties on the store. Arguments passed with an action call is cloned. This prevents f.ex. an object passed with an action to later be mutated and reflected in the store.
```javascript
var AppStore = $$.store({
  todos: [],
  filter: {
    completed: true,
    active: true
  },
  addTodo: function (todo) {
    this.todos.push(todo);
  },
  filter: function (filterOptions) {
    this.filter = filterOptions;
  }
});
```

####<a name="store-emitchange">Emit change</a>
When the state of the store has been mutated you want to let listening components about the change. By calling **emitChange** on a store, listening components are notified that a change has occured.
```javascript
var AppStore = $$.store({
  todos: [],
  filter: {
    completed: true,
    active: true
  },
  addTodo: function (todo) {
    this.todos.push(todo);
    this.emitChange();
  },
  filter: function (filterOptions) {
    this.filter = filterOptions;
    this.emitChange();
  }
});
```

####<a name="store-emit">Emit</a>
There are situations when you want to notify components about a specific state change, not just reflect existing state in a store. This would typically be triggering transitions in a compoenent, trigger animations or just basically react to a state change, not reflect the value of it.
```javascript
var AppStore = $$.store({
  todos: [],
  filter: {
    completed: true,
    active: true
  },
  addTodo: function (todo) {
    this.todos.push(todo);
    this.emitChange();
    this.emit('todo:added'); // Trigger a css background color fader on the new todo
  },
  filter: function (filterOptions) {
    this.filter = filterOptions;
    this.emitChange();
  }
});
```

####<a name="store-exports">Exports</a>
Components will need to extract the states from the store. This is done
by creating an exports object  with methods from. These methods should only be "getters", not "setters". When a value is returned from an export method it will be cloned to avoid mutation in the store. The method itself is bound to the store.
```javascript
var AppStore = $$.store(  todos: [],
  filter: {
    completed: true,
    active: true
  },
  addTodo: function (todo) {
    this.todos.push(todo);
    this.emitChange();
    this.emit('todo:added'); // Trigger a css background color fader on the new todo
  },
  filter: function (filterOptions) {
    this.filter = filterOptions;
    this.emitChange();
  },
  exports: {
    getTodos: function () {
      return this.todos;
    }
  }
});
```

###<a name="jflux-components">Components</a>
All your UI is constructed with components. They are composable, meaning that components
can live inside other components.

####<a name="components-createacomponent">Create a component</a>
The minimum boilerplate for a component is to define a render callback that
returns a DOM representation with a top node. The default render method compiles a single `div`.
```javascript
var MyComponent = $$.component({

  render: function (compile) {
    return compile(
      '<h1>',
        'Hello world',
      '</h1>'
    );
  }

});
```

####<a name="components-compile">Compile</a>
The first and only argument passed to a components render method is the `compile` function. The compile function
returns a UI data structure that jFlux understands. Compile can take the following arguments:

- string
- number
- array of compiled DOM representations
- Component

The arguments builds a DOM structure that will be appended to wherever the component
is appended or diffed with existing render of the component.

####<a name="components-properties">Properties</a>
Components can receive properties. These properties are passed when a component is rendered to an existing DOM node, or when composed into an other component. The properties are an object that can take any values. You point to the passed properties with: `this.props`.

```javascript
var MyComponent = $$.component({

  render: function (compile) {
    return compile(
      '<h1>',
        this.props.title,
      '</h1>'
    );
  }

});

$$.render(MyComponent({title: 'Hello world!'}), 'body');
```

####<a name="components-map">Map</a>
If you need to compile a list of elements you can use the `map` method provided. It takes its own compile function.
The context of the map callback will be unique. You can use that context to add "render-props", point to the item
in the current iteration and the "props" passed to the component itself.
```javascript
var MyComponent = $$.component({

  compileList: function (compile) {
    return compile(
      '<li>',
        this.item,
      '</li>'
    );
  },
  render: function (compile) {
    var list = this.map(['foo', 'bar'], this.compileList);
    return compile(
      '<ul>',
        list,
      '</ul>'
    );
  }

});
```

####<a name="components-attributes">Attributes</a>
You can add attributes as you normally would, but jFlux is aware of the context you are in an can get values from that context.
You have your main component context, where you define render etc., but you also have a context when iterating lists which you
can grab values from. In a list the item iterated over is the property "item". You also have access to "props". The
rest of the context you can use to add yourn own "render props".

```javascript
var MyComponent = $$.component({

  // Setting a prop on the component
  myList: [{id: '1', title: 'foo'}, {id: '2', title: 'bar'}],
  myId: 'foo',

  // This method is called with the map method below
  compileList: function (compile) {
    return compile(
      // Item can be pointed to via the attribute
      '<div $$-id="item.id">' + this.item.title + '</div>'
    );
  },
  render: function (compile) {
    var list = this.map(this.myList, this.compileList);
    return compile(
      '<div $$-id="myId"></div>'
    );
  }

});
``

#####<a name="components-attributes-id">$$-id</a>
```javascript
var MyComponent = $$.component({
  myId: 'foo',
  render: function (compile) {
    return compile(
      '<ul $$-id="myId">',
        list,
      '</ul>'
    );
  }
});
```
#####<a name="components-attributes-class">$$-class</a>
The class attribute needs to point to an object where the keys are the class names and the value is either true or false. True values will add the class name, false will not.
```javascript
var MyComponent = $$.component({

  listClass: {
   'active': $$.path() === '/',
   'list-class': true
  },
  render: function (compile) {
    return compile(
      '<ul $$-class="listClass">',
        list,
      '</ul>'
    );
  }

});
```
#####<a name="components-attributes-checked">$$-checked</a>
```javascript
var MyComponent = $$.component({
  isActive: true,
  render: function (compile) {
    return compile(
      '<input type="checkbox" $$-checked="isActive"/>'
    );
  }
});
```
#####<a name="components-attributes-disabled">$$-disabled</a>
```javascript
var MyComponent = $$.component({
  isDisabled: false,
  render: function (compile) {
    return compile(
      '<input type="checkbox" $$-disabled="isDisabled"/>'
    );
  }
});
```
#####<a name="components-attributes-value">$$-value</a>
```javascript
var MyComponent = $$.component({
  this.render = function (compile) {
    this.myValue = 'Hello there';
    return compile(
      '<input type="text" $$-value="myValue"/>'
    );
  }
});
```

#####<a name="components-attributes-style">$$-style</a>
```javascript
var MyComponent = $$.component({
  style: {
    color: 'red'
  },
  render: function (compile) {
    return compile(
      '<div $$-style="style"/>'
    )
  }
});
```

#####<a name="components-attributes-href">$$-href</a>
```javascript
var MyComponent = $$.component({
  url: 'http://www.jflux.io',
  render: function (compile) {
    return compile(
      '<a $$-href="url"/>'
    );
  }
});
```

#####<a name="components-attributes-show">$$-show</a>
```javascript
var MyComponent = $$.component({
  isReady: true,
  render: function (compile) {
    return compile(
      '<div $$-show="isReady"></div>'
    );
  }
});
```

#####<a name="components-attributes-data">$$-data</a>
```javascript
var MyComponent = $$.component({
  someData: {
    foo: 'bar'
  },
  events: {
    'click', 'onClick'
  },
  onClick: function (event) {
    var data = $$.data(event);
    console.log(data.foo); // "bar"
  },
  render: function (compile) {
    return compile(
      '<div $$-data="someData"></div>'
    );
  }
});
```

####<a name="components-composing">Composing</a>
A component DOM representation can take other components as arguments.

```javascript
var Item = $$.component({
  render: function (compile) {
    return compile(
      '<li>',
        this.props.label,
      '</li>'
    );
  }
});
var List = $$.component({
  compileItems: function (compile) {
    return compile(
      Item({label: this.item})
    );
  },
  render: function (compile) {
    var items = this.map(['foo', 'bar'], this.compileItems);
    return compile(
      '<ul>',
        Item({label: 'First in list'}),
        items,
      '</ul>'
    );
  }
});
```
####<a name="components-transclusion">Transclusion</a>
You can include dynamic HTML inside components. The HTML defined will run in the context of the component it is included in, not the context from where it is defined. Use the special property `this.props.children` to define where the children should be put.

```javascript
var Form = $$.component({
  render: function (compile) {
    events: {
      'click :submit': 'submitForm'
    },
    submitForm: function (event) {
      event.preventDefault();
      $.post(this.props.url);
    },
    return compile(
      '<form>',
        this.props.children,
      '</form>'
    );
  }
});

var MyForm = $$.component({
  render: function (compile) {
    return compile(
      Form({
        url: '/comments',
        wrapper: {'myWrapper': true}
      },
        '<div $$-class="props.wrapper">',
          '<input type="text" placeholder="Type comment"/>',
          '<button type="submit">Add comment</button>',
        '</div>'
      )
    );
  }
});
```

####<a name="components-listeningtouievents">Listening to UI events</a>
Since jFlux is based on jQuery you will be able to use delegated events
in your component to listen for user interaction.

```javascript
var MyComponent = $$.component({
  events: {
    'click': 'log'
  },
  log: function () {
    console.log('I was clicked!');
  },
  render: function (compile) {
    return compile(
      '<button>',
        'Click me!',
      '</button>'
    );
  }
});
```

If the node you listen to is nested in the DOM representation, use delegation:

```javascript
var MyComponent = $$.component({
  events: {
    'click button': 'log'
  },
  log: function () {
    console.log('I was clicked!');
  },
  render: function (compile) {
    return compile(
      '<div>',
        '<button>',
          'Click me!',
        '</button>',
      '</div>'
    );
  }
});
```

####<a name="components-updates">Updates</a>
Components are very smart when updating. They will do a diff of the jFlux UI structure and only do necessary DOM operations to update the UI. This includes attributes, text nodes and lists. You can call `this.update()` at any time, though they are normally used with state updates.

```javascript
var MyComponent = $$.component({
  style = {
    color: 'red'
  },
  events: {
    'click button': 'changeColor'
  },
  changeColor: function () {
    this.style.color = this.style.color === 'red' ? 'blue' : 'red';
    this.update();
  },
  render: function (compile) {
    return compile(
      '<div $$-style="style">',
        '<button>Change color</button>',
      '</div>'
    );
  }
});
```

####<a name="components-listeningtostatechanges">Listening to state changes</a>
Components listens to state changes in stores. They do this by using the `listenTo` method.
There are two types of listeners. One that listens to the general 'change' event, and one
that listens to any specific events you emit.

```javascript
var MyComponent = $$.component({
  init: function () {
    this.listenToChange(AppStore, this.update);
    this.listenTo(AppStore, 'todo:added', this.update);
  },
  render: function (compile) {
    return compile(
      '<h1>',
        AppStore.getTodos().length,
      '</h1>'
    );
  }
});
```

####<a name="components-bindingtoinputs">Binding to inputs</a>
Sometimes you want to bind to inputs. This makes it easier for you to transfer values from an element in the DOM to a state in your component. If you need to react to binding changes, use the special `$$-change` event on the input.
```javascript
var MyComponent = $$.component({
  item: {
    title: '',
    description: ''
  },
  bindings: {
    'input[name="title"]': 'item.title',
    'input[name="description"]': 'item.description
  },
  render: function (compile) {
    this.invalidTodo = !(this.item.title && this.item.description);
    return compile(
      '<div>',
        '<input name="title" type="text" $$-value="item.title"/>',
        '<input name="description" type="text" $$-value="item.description"/>',
        '<button $$-disabled="invalidTodo">',
          'Add',
        '</button>',
      '</div>'
    );
  };
});
```
The button in this example will only be enabled if there is both a title and a description. Also notice that we set
the values of the inputs to the binded properties.

####<a name="components-afterrender">After render</a>
You might need to manipulate the DOM content after a render. F.ex. using plugins that attach to specific DOM nodes.
You can use **afterRender()** for that.

```javascript
var MyComponent = $$.component({
  afterRender: function () {
    MyExternalLib.attachTo(this.$el[0]);
  },
  render: function (compile) {
    return compile(
      '<div></div>'
    );
  }
});
```

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
