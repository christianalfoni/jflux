$$.config({
  baseUrl: '/demo-pushstate',
  pushState: true
});

var Home = $$.component({

  render: function (compile) {
    return compile(
      '<p>',
        this.props.content,
      '</p>',
      '<a href="/slide2">Slide2</a>'
    );
  }

});

$$.route('/', function () {
  console.log('rendering again!');
  $$.render(Home({content: 'slide1'}), 'body');
});

$$.route('/slide2', '/slide3');

$$.route('/slide3', function () {
  $$.render(Home({content: 'slide 2 redirected to slide3'}), 'body');
})