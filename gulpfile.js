'use strict';

var gulp  = require('gulp');
var fs    = require('fs');

fs.readdirSync(__dirname + '/gulp').forEach(function (task) {
  require('./gulp/' + task);
});

gulp.task('default', ['sass', 'sass:watch', 'browserSync', 'bundleJS'], function(){
  gulp.watch(['./app/*.js','./app/**/*.js'], ['cleanJS', 'bundleJS']);
});
