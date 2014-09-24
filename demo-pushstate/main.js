$$.config({
  baseUrl: '/demo-pushstate',
});

var Home = $$.component(function () {

  this.render = function (compile) {
    return compile(
      '<p>',
        this.props.content,
      '</p>',
      '<a href="/slide2">Slide2</a>'
    );
  };

});

$$.route('/', function () {
  console.log('rendering again!');
  $$.render(Home({content: 'slide1'}), 'body');
});

$$.route('/slide2', function () {
  $$.render(Home({content: 'slide2'}), 'body');
});