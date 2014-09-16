var $$ = require('jflux');
var HelloWorld = require('./HelloWorld.js');

$$.route('/', function () {

  $$.render(HelloWorld(), 'body');

});