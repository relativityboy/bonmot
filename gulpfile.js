// Include gulp
var gulp = require('gulp');

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

// Default Task
gulp.task('default', ['lint', 'scripts']);