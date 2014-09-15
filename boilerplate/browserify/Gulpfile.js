var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var shell = require('gulp-shell');

var appOptions = {

  appDir: './app',
  distDir: './dist',
  buildDir: './build',
  specsDir: './specs',
  entryFile: 'main.js',
  vendorsFile: 'vendors.js',

  // Add other libraries here, if any
  libs: [
    'jquery',
    'jflux'
  ]

};

// The task that handles both development and deployment
var browserifyTask = function (bundleOptions) {

  // This bundle only runs when you start to develop,
  // it is needed to prevent rebundling external deps
  // on project changes
  var vendorBundler = browserify({
    debug: bundleOptions.debug,
    require: appOptions.libs
  });

  // This bundle is for the application
  var appBundler = browserify({
    entries: [appOptions.appDir + '/' + appOptions.entryFile],
    debug: bundleOptions.debug,

    // These options are needed by Watchify
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  // Add libs as externals
  appOptions.libs.forEach(function (lib) {
    appBundler.external(lib);
  });

  // The rebundle process
  var rebundle = function () {

    var start = Date.now();
    appBundler.bundle()
      .pipe(source(appOptions.entryFile))
      .pipe(gulpif(bundleOptions.uglify, streamify(uglify())))
      .pipe(gulp.dest(bundleOptions.dest))
      .pipe(notify(function () {
        console.log('Built in ' + (Date.now() - start) + 'ms');
      }));

  };

  // Fire up Watchify when developing
  if (bundleOptions.watch) {
    appBundler = watchify(appBundler);
    appBundler.on('update', rebundle);
  }

  // Run the vendor bundle when the default Gulp task starts
  vendorBundler.bundle()
    .pipe(source(appOptions.vendorsFile))
    .pipe(gulpif(bundleOptions.uglify, streamify(uglify())))
    .pipe(gulp.dest(bundleOptions.dest));

  return rebundle();

};

gulp.task('default', function () {

  browserifyTask({
    watch: true,
    dest: appOptions.buildDir,
    uglify: false,
    debug: true
  });

});

gulp.task('deploy', function () {

  browserifyTask({
    watch: false,
    dest: appOptions.distDir,
    uglify: true,
    debug: false
  });

});

gulp.task('test', shell.task([
  './node_modules/.bin/jasmine-node ' + appOptions.specsDir + ' --autotest --watch ' + appOptions.appDir + ' --color'
]));