var gulp            = require('gulp');
var sass            = require('gulp-sass');
var concat          = require('gulp-concat');
var sourcemaps      = require('gulp-sourcemaps');
var minifyCss       = require('gulp-minify-css');
var plumber         = require('gulp-plumber');
var browserSync     = require('browser-sync').create();

gulp.task('sass', function () {
  gulp.src(['./app/scss/style.scss'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('style.css'))
      .pipe(minifyCss())
      .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream());
});

gulp.task('sass:watch', function () {
  gulp.watch('./app/scss/**', ['sass']);
});
