var gulp            = require('gulp');
var clean           = require('gulp-clean');

gulp.task('clean', function () {
  gulp.src(['./app/css/**.css','./app/js/**.js'], {read: false})
  .pipe(clean({force: true}));
});

gulp.task('cleanJS', function () {
  gulp.src(['./app/js/**.js'], {read: false})
  .pipe(clean({force: true}));
});

gulp.task('cleanCSS', function () {
  gulp.src(['./app/css/*.css'], {read: false})
  .pipe(clean({force: true}));
});
