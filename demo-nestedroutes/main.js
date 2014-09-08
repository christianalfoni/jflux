var App = $$.component(function (template) {
  this.render(function () {
    return template(
      '<div>',
        '<h1>Application</h1>',
        '<a href="/">Home</a> <a href="/posts">Posts</a>',
        '<div id="content"></div>',
      '</div>'
    );
  });
});

var Home = $$.component(function (template) {
  this.render(function () {
    return template(
      '<h2>Home</h2>'
    );
  });
});

var Posts = $$.component(function (template) {
  this.render(function () {
    return template(
      '<div>',
        '<h2>Posts</h2>',
        '<a href="/posts/1">Post 1</a> <a href="/posts/2">Post 2</a>',   
        '<div id="content-post"></div>',
      '</div>'
    );
  });
});

var Post = $$.component(function (template) {
  this.render(function () {
    return template(
      '<div>',
        '<h2>',
          'Post ' + this.props.id,
        '</h2>',
        '<div>My post</div>',
      '</div>'
    );
  });
});

$$.config({
  baseUrl: '/demo-nestedroutes'
});

$$.route('/', function () {
  $$.render(App(), 'body');
  $$.render(Home(), '#content');
});

$$.route('/posts', function () {
  $$.render(App(), 'body');
  $$.render(Posts(), '#content');
  $$.render(Post({id: 1}), '#content-post');
});

$$.route('/posts/{id}', function (params) {
  $$.render(App(), 'body');
  $$.render(Posts(), '#content');
  $$.render(Post(params), '#content-post');
});