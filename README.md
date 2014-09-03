## jFramework (proof of concept)

An easy to use unidirectional component based framework

- [The concept](#concept)
- [API](#api)
  - [components](#components)

### The concept
We have all come to know and love our JS frameworks. Ember JS, Angular JS, React JS, Backbone, Knockout etc. All of them has given us the power of productivity and they make
it even more fun to write code.

What I have realised though is that I rarely use much of what is provided to me from these frameworks. There are so many concepts, so many methods and they do not completely solve my biggest problem; "Keeping my code sane and scalable". I feel like I always have to twist and turn my code every time I implement something new. It is difficult to identify the exact point where you start feeling bad about your code, and what you did to get to that point.

What I do know, is that you basically want to control two things in your application. **State** and **UI**. In MVC the state is spread between your domain models, which are the state of your database entities, and the controllers, which holds the state of your application. Your controllers mutate the models directly and/or some internal controller state. This makes it very hard to scale the application. It is a challenge to make new implementations aware of the state changes on your existing models, and more challenging is to relate to the state changes in your existing controllers. How do you make new implementations aware of these model and internal controller state changes?

Facebooks FLUX architecture aims to solve this problem by creating a unidirectonal flow. You have your states and the only way those states can change is by actions going through a dispatcher and down to your state handlers. These state handlers, called stores, will then notify your application about a change and rerender the UI. It is not possible for your controller to manipulate the state of your application, only the UI state. This is a very important seperation. The controller might have some state about all inputs not being filled, but it does not contain state about the application having saved the form. The reason is that the inputs are scoped to the UI and the successfull saving of the form is something the application does, something other components might be interested in. What I do not quite understand with Facebooks strategy is that they want to rerender the whole application on state changes, instead of notifying the specific components (UI) that rely on those changes.

jFramework takes the principles of FLUX, forcing a unidirectonal flow, but encourages keeping your components (UI) as isolated as possible. It is also focused on being a very restricted and simple API. It should be easy to understand, learn and be productive in. And of course have fun programming :-)

### So you thought jQuery was out?
React JS uses a string representation of the UI before and after a state change to calculate DOM operations that is required to make the necessary changes to the UI. jFramework does something similar. It builds up its own internal structure of the UI using jQuery and checks differences on an object level, not a string level.

I think it is time to check some code.

### Components
```javascript

    var MyComponent = $$.component(function () {
        this.render(function () {
            return this.template(
                '<h1>',
                    'Hello world!',
                '</h1>'
            );
        });
    });
    $$.render(MyComponent(), 'body');

```
This code defines a callback that runs whenever the component needs to render. It returns a template. A template is a method that takes unlimited arguments that builds
up a DOM structure. This syntax makes it very easy to write HTML in javascript and it
gives some advantages. Lets have a look.

### Scope in components
```javascript
var MyComponent = $$.component(function () {
  var myStaticValue = 'foo';
  this.render(function () {

    // You can pass any string or number
    // value as an argument and it will
    // render as a text node
    return this.template(
      '<h1>',
        myStaticValue,
      '</h1>'
    );
  });
});
```
The whole component callback is the scope of the HTML rendered. You can use any string or number value and it will be rendered as a textnode.
### Passing properties to a component
```javascript
var MyComponent = $$.component(function () {
  this.render(function () {
    return this.template(
      '<h1>',
        this.props.title,
      '</h1>''
    );
  });
});
$$.render(MyComponent({title: 'Hello world!'}), 'body');
```
You can pass properties to an object and use them with `this.props` in the component.
### Composing components
```javascript
var Title = $$.component(function () {
  this.render(function () {
    return this.template(
      '<small>',
        this.props.title,
      '</small>'
    );
  });
});
var MyComponent = $$.component(function () {
  this.render(function () {
    return this.template(
      '<h1>',
        Title({title: 'Wazup?'}),
      '</h1>'
    );
  });
});
```
You can use a component inside an other component. Passing properties is the same in this situation.
### Create lists
```javascript
var MyList = $$.component(function () {
  this.render(function () {
    var items = ['foo', 'bar'].map(function (title, index) {
      return this.template(
        '<li id="' + index + '">',
          title,
        '</li>'
      );
    }, this);
    return this.template(
      '<ul>',
        items,
      '</ul>'
    );
  });
});
```
In the render callback you can create an array of templates. The only requirement is that the main node of the template has an ID. It needs this to keep track of the items in the list when updating it. It can either be the index, or usually you will have an ID related to the items in a list.

**Pro tip** Templates returned to a list can be a component. Be sure to pass an ID property to keep track of the components in the list, `Item({id: 'foo'})`.
### Listening to UI events
```javascript
var MyList = $$.component(function () {

  this.log = function () {
    console.log('I was clicked!');
  };

  this.listenTo('click', this.log);
  this.render(function () {
    return this.template(
      '<button>',
        'Click me!',
      '</button>'
    );
  });
});
```
You can listen to UI events with normal jQuery code, using `listenTo`. In this case the top node was the button to listen for. If the button was further down in the template tree you would do this:
```javascript
var MyList = $$.component(function () {

  this.log = function () {
    console.log('I was clicked!');
  };

  this.listenTo('click', 'button', this.log);
  this.render(function () {
    return this.template(
      '<div>',
        '<button>',
          'Click me!',
        '</button>',
      '</div>'
    );
  });
});
```
As you can see you use jQuery delegated events. You can use any jQuery selector to handle UI events in your template.