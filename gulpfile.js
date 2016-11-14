// Include gulp
var gulp = require('gulp');
var karma = require('karma');
// Include Our Plugins
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src('src/**/*.js')
    .pipe(gulp.dest('dist'))
});


//test
gulp.task('test', function (done) {
  new karma.Server({
    //configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});


// Default Task
gulp.task('default', ['lint', 'scripts']);