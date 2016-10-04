var gulp            = require('gulp');
var concat          = require('gulp-concat');
var uglify 					= require('gulp-uglify');
var ngAnnotate 			= require('gulp-ng-annotate');
var sourcemaps      = require('gulp-sourcemaps');
var plumber         = require('gulp-plumber');


//concat project js files
gulp.task('bundleJS', ['cleanJS'], function () {

  return gulp.src(['./app/src/app.js','./app/src/**/*.js', '!./app/src/**/*.spec.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/js'));
});
