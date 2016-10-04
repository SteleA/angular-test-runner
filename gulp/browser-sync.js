var gulp  = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('browserSync', ['sass'], function(){

  browserSync.init({
    server: {
            baseDir: './app'
        },
    files: ['app/css/**'],
    browser: 'google chrome',
    port: 4000,
    open: true
  });

  gulp.watch(['app/src/*.*','app/src/**','./app/index.html'], browserSync.reload);
});
