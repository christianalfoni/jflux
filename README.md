# jFramework

An easy to use unidirectional component based framework. Please have a look at the examples for a quick overview of how jFramework works. Run `python -m SimpleHTTPServer 3000` in your terminal at the root of this repo, then access f.ex. `localhost:3000/demo-todomvc`.

Please read the following post if you are interested in the background of this project: [jQuery as a framework, could that work?](http://christianalfoni.github.io/javascript/2014/09/08/jquery-as-a-framework-could-that-work.html)

- [State of development](#development)
- [The concept](#concept)
- [Features](#features)
- [API](#api)
  - [jFramework](#jframework)
    - [$$.config](#jframework-config)
    - [$$.component](#jframework-component)
    - [$$.action](#jframework-action)
    - [$$.state](#jframework-state)
    - [$$.route](#jframework-route)
    - [$$.render](#jframework-render)
    - [$$.run](#jframework-run)
    - [$$.generateId](#jframework-generateid)
    - [$$.path](#jframework-path)
    - [$$.addClass](#jframework-addclass)
  - [Actions](#actions)
    - [Create actions](#actions-createactions)
    - [Listening to actions](#actions-listeningtoactions)
  - [State](#state)
    - [Create states](#state-createstates)
    - [State mutators](#state-statemutators)
    - [Listening to actions](#state-listeningtoactions)
    - [Exports](#state-exports)
  - [Components](#components)
    - [Create a component](#components-createcomponent)
    - [Templates](#components-template)
    - [Properties](#components-properties)
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

## <a name="development">State of development</a>
jFramework is currently in **proof of concept**. The current code is implemented without consideration of testing, a project structure and a consistent API design.

Based on feedback the project will move into **alpha** which will have a project structure, testing and a reviewed API design. I will also open up for contributions on github.

## <a name="concept">The concept</a>
jFramework takes concepts from big frameworks like Angular JS, Ember JS, React JS with FLUX etc. and exposes a very simple and easy to use API. It is based on jQuery, which lets you take something you already
know and take it further. Where jFramework fits in the ecosystem of javascript frameworks is yet to see.

## <a name="features">Features</a>
- **Unidirectional** state flow which makes it easier to scale the application
- **Components** that defines a DOM structure and when updated only changes DOM content
that it needs to keep in sync
- **Composable** components that lets you define a small section of DOM content, add behaviour to it and reuse the component throughout your application
- Strong concepts of where to put **state** and how to update that state
- A **router**
- Use jQuery **plugins** to add complex behaviour to your components

##<a name="api">API</a>

###<a name="jframework">jFramework ($$)</a>
jFramework is available as `$$` on the global scope. It also supports common module loaders like [requirejs]() and [browserify]().

####<a name="jframework-config">$$.config(obj)</a>
Configures jFramework. The following example shows default values.
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
####<a name="jframework-action">$$.action([array])</a>
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

####<a name="jframework-state">$$.state(func)</a>
Returns a state object, please go to [State](#state) to read more about the state API.
```javascript
var AppState = $$.state(function (flush) {
  var list = [];
  this.exports({
    getList: function () {
      return list;
    }
  });

});
```

####<a name="jframework-component">$$.component(func)</a>
Returns a component. Please go to [Components](#components) to read more about the component API.
```javascript
var MyComponent = $$.component(function (template) {

  this.render(function () {
    return template(
      '<h1>',
        'Hello world',
      '</h1>'
    );
  });

});
```

####<a name="jframework-route">$$.route(path, func)</a>
Registers a route. Please go to [Router](#router) to read more about the route API.
```javascript
$$.route('/', function () {
  $$.render(App(), 'body');
});
```

####<a name="jframework-render">$$.render(component, target)</a>
Renders a component to the target element. The target can be any jQuery selector.
```javascript
$$.route('/', function () {
  $$.render(App(), 'body');
});
```
##### What it does
When rendering a component to a target it will check that target for any previous renders. If it finds the same component type already rendered it will update that component if the properties passed to the component has changed. If a different component is being rendered, it will remove the previous component and add the new one. If any other components has been rendered within target, they will also be removed by jFramework. If no components registered on the target it will of course just render. 

####<a name="jframework-run">$$.run()</a>
Normally you do not need to run this method. It will run automatically on page load. If you have configured `autoRoute:false`, or use [requirejs](), you will ned to run the method. It triggers the router and handling of url changes and components.
```javascript
$$.route('/', function () {});
// More routes
$$.run();
```
##### What it does

1. Register a delegated listener to all `<a/>` elements. When clicked it will use the `href` attribute value to resolve a route and trigger it.

2. Triggers the initial route based on current url

####<a name="jframework-generateid">$$.generateId([string])</a>
Lists in templates require IDs to handle changes in that list. If you do not have an
ID, you can create one with jFramework. This could be handy when waiting for the ID from the backend or you are creating a list that for some reason does not have IDs, but still needs to be manipulated with sorting, filtering etc. An ID is always a string.
```javascript
var id = $$.generateId(); // f.ex. "0"
var todoId = $$.generateId('temp_todo'); // f.ex. "temp_todo_0"
```

####<a name="jframework-path">$$.path()</a>
Returns the current route path.
```javascript
$$.path() // f.ex. "/posts/1"
```
####<a name="jframework-path">$$.addClass(obj)</a>
A helper method to create an html `class=""` string where the keys of the object is added as a class name if the value of the key is true.
```javascript
var MyComponent = $$.component(function (template) {
  
  this.render(function () {
    return template(
      '<div' + $$.addClass({enabled: this.props.isEnabled}) + '>',
        'Hello world',
      '</div>'
    );
  });

});
```
###<a name="actions">Actions</a>
Actions defines what state changes your application is able to do. Reading the list of actions
is actually reading the functionality of your application.

####<a name="jframework-createactions">Create actions</a>
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

####<a name="jframework-listeningtoactions">Listening to actions</a>
Only states created will be able to listen to actions, do state changes and
flush updates to listening components.
```javascript
var AppState = $$.state(function (flush) {
  
  // A state
  var todos = [];

  // A state mutator
  this.addTodo = function (todo) {
    todo.id = $$.generateId();
    todos.push(todo);
    flush();
  };

  // Listen to an action
  this.listenTo(actions.addTodo, this.addTodo);

  // Export methods that components can use to get
  // state information
  this.exports({
    getTodos: function () {
      return todos;
    }
  });

});
```

### <a name="state">State</a>
State objects holds state of your application. You may only have on "AppState" object or
multiple state objects that will handle different types of state in your application.

####<a name="jframework-creatingstates">Creating states</a>
Your state is contained inside one or multiple state objects. The states are
normally defined by declaring a variable.
```javascript
var AppState = $$.state(function (flush) {
  
  // A todos list state
  var todos = [];

  // A filter state
  var filter = {
    completed: true,
    active: true
  };

});
```

####<a name="jframework-statemutators">State mutators</a>
State mutators are normally triggered by an action listener and will change
declared variables.
```javascript
var AppState = $$.state(function (flush) {
  
  var todos = [];
  var filter = {
    completed: true,
    active: true
  };

  // The mutator use data passed to mutate
  // a state. Then it flushes to inform
  // listening components about the update
  this.addTodo = function (todo) {
    todo.id = $$.generateId();
    todos.push(todo);
    flush();
  };


  this.filter = function (filterOptions) {
    filter = filterOptions;
    flush();
  };

});
```

####<a name="jframework-listeningtoactions">Listening to actions</a>
A state object in jFramework listens to actions and trigger their 
state mutators.
```javascript
var AppState = $$.state(function (flush) {
  
  var todos = [];
  var filter = {
    completed: true,
    active: true
  };

  this.addTodo = function (todo) {
    todo.id = $$.generateId();
    todos.push(todo);
    flush();
  };

  this.filter = function (filterOptions) {
    filter = filterOptions;
    flush();
  };

  // Listen to the function that is used to trigger
  // the action
  this.listenTo(actions.addTodo, this.addTodo);
  this.listenTo(actions.filter, this.filter);

});
```

####<a name="jframework-exports">Exports</a>
Components will need to extract the states from the state object. This is done
by defining export methods. These methods should only be "getters", not "setters".
State change is only done by actions.
```javascript
var AppState = $$.state(function (flush) {
  
  var todos = [];
  var filter = {
    completed: true,
    active: true
  };

  this.addTodo = function (todo) {
    todo.id = $$.generateId();
    todos.push(todo);
    flush();
  };

  this.filter = function (filterOptions) {
    filter = filterOptions;
    flush();
  };

  this.listenTo(actions.addTodo, this.addTodo);
  this.listenTo(actions.filter, this.filter);

  // We define a method that will be available to components.
  // It returns a list of todos based on the current state of
  // the filter
  this.exports({
    getTodos: function () {
      return todos.filter(function (todo) {
        return (filter.completed && todo.completed) || (filter.active && !todo.completed);
      });
    }
  });

});
```

###<a name="jframework-components">Components</a>
All your UI is constructed with components. They are composable, meaning that components
can live inside other components.

####<a name="components-creatingacomponent">Creating a component</a>
The minimum boilerplate for a component is to define a render callback that
returns a template with a top node.
```javascript
var MyComponent = $$.component(function (template) {
  
  this.render(function () {
    return template(
      '<h1>',
        'Hello world',
      '</h1>'
    );
  });

});
```

####<a name="components-templates">Templates</a>
The first and only argument passed to a component is the `template` function. The template
function returns a UI data structure that jFramework understands. A template can take
the following arguments:

- string
- number
- array of templates
- Component

The arguments builds a DOM structure that will be appended to wherever the component
is appended.

```javascript
var MyComponent = $$.component(function (template) {
  
  this.render(function () {
    var list = ['foo', 'bar'].map(function (label) {
      return template(
        '<li>',
          label
        '</li>'
      );
    });
    return template(
      '<ul>',
        list,
      '</ul>'
    );
  });

});
```

####<a name="components-properties">Properties</a>
Components can receive properties. These properties are passed when a component is rendered
to an existing DOM node, or when composed into an other component. The properties are
an object that can take any values. You point to the passed properties with: `this.props`.

```javascript
var MyComponent = $$.component(function (template) {
  
  this.render(function () {
    return template(
      '<h1>',
        this.props.title,
      '</h1>'
    );
  });

});

$$.render(MyComponent({title: 'Hello world!'}), 'body');
```

####<a name="components-composing">Composing</a>
A component template can take other components as arguments.

```javascript
var Item = $$.component(function (template) {
  this.render(function () {
    return template(
      '<li>',
        this.props.label,
      '</li>'
    );
  });
});
var List = $$.component(function (template) {
  this.render(function () {
    var items = ['foo', 'bar'].map(function (label) {
        return template(
          Item({label: label})
        );
      });
    return template(
      '<ul>',
        Item({label: 'First in list'}),
        items,
      '</ul>'
    );
  });
});
```

####<a name="components-listeningtouievents">Listening to UI events</a>
Since jFramework is based on jQuery you will be able to use delegated events
in your component to listen for user interaction.

```javascript
var MyComponent = $$.component(function (template) {
  this.log = function () {
    console.log('I was clicked!');
  };

  // The top node is what we are listening to, so no need to
  // set a target
  this.listenTo('click', this.log);
  this.render(function () {
    return template(
      '<button>',
        'Click me!',
      '</button>'
    );
  });
});
```

If the node you listen to is nested in the template, use delegation:

```javascript
var MyComponent = $$.component(function (template) {
  this.log = function () {
    console.log('I was clicked!');
  };

  // The second argument can be any jQuery selector
  this.listenTo('click', 'button', this.log);
  this.render(function () {
    return template(
      '<div>',
        '<button>',
          'Click me!',
        '</button>',
      '</div>'
    );
  });
});
```

####<a name="components-plugins">Plugins</a>
You can use any and multiple jQuery plugins in your component. This makes components increadibly
powerful as there already are lots of plugins out there.

```javascript
var MyComponent = $$.component(function (template) {

  // First argument is the name of the plugin, f.ex. $('a').dropdown() will be
  // 'dropdown'. The second argument is only needed if the plugin is triggered
  // on a nested element in the template. The last argument are the options passed
  // to the plugin
  this.plugin('someJQueryPlugin', 'span', {someOption: 'someValue'});
  this.render(function () {
    return template(
      '<div>',
        '<span></span>',
      '</div>'
    );
  });
});
```

####<a name="components-updates">Updates</a>
Components are very smart when updating. They will do a diff of the jFramework UI structure
and only do necessary DOM operations to update the UI. This includes attributes, text nodes
and lists. You can call `this.update()` at any time, though they are normally used with
state updates.

```javascript
var MyComponent = $$.component(function (template) {
  
  var color = 'red';

  this.changeColor = function () {
    color = color === 'red' ? 'blue' : 'red';
    this.update();
  };

  this.listenTo('click', 'button', this.changeColor);
  this.render(function () {
    return template(
      '<div style="color: ' + color + '">',
        '<button>Change color</button>',
      '</div>'
    );
  });
});
```

####<a name="components-listeningtostatechanges">Listening to state changes</a>
Components listens to state changes on state objects. They do this by using the `listenTo`
method also used to listen for UI interaction. When the state object flushes the component
will rerender itself. 

```javascript
var MyComponent = $$.component(function (template) {
  this.listenTo(AppState, this.update);
  this.render(function () {
    return template(
      '<h1>',
        AppState.getTitle(),
      '</h1>'
    );
  });
});
```

####<a name="components-bindingtoinputs">Binding to inputs</a>
Sometimes you want to bind to inputs. The inputs might affect a state in your component and you need it to update automatically. Meet bind, it will update your component on 
input change:

```javascript
var MyComponent = $$.component(function (template) {
  var todo = {
    title: '',
    description: ''
  };
  this.bind(model, 'title', 'input[name="title"]');
  this.bind(model, 'description', 'input[name="description"]');
  this.render(function () {
    return template(
      '<div>',
        '<input name="title" type="text"/>',
        '<input name="description" type="text"/>',
        '<button' + (todo.title && todo.description ? '' : ' disabled') + '>',
          'Add',
        '</button>',
      '</div>'
    );
  });
});
```
The button in this example will only be enabled if there is both a title and a description.

##<a name="router">Router</a>
jFramework supports both hash and popstate routing. jFramework knows about its rendered components and lets you very easily render components to any section of the screen, much like nested routes. It also supports dynamic links and redirects.

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
By default the router will trigger itself on page load. You can configure this behaviour with the [config](#jframework-config) method. You might need to download some resources before triggering the router or you might be using *requirejs*. In that case you will have to trigger the router manually. This is an example with requirejs:
```javascript
require(['jframework', 'MyApp'], function ($$, MyApp) {
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
Instead of defining nesting in your code, like with callbacks etc. jFramework takes a different approach. Since it has full control of components in your page you do not have to worry about overriding or unecessarily rerendering them. That means we can define how the page should look on each route and jFramework will update the current DOM to that state as effectively as possible.
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