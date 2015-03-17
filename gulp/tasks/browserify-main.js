'use strict';

var gulp = require('gulp');
var config = require('../config').browserify;
var bundler = require('../util/bundler');

gulp.task('main.js', function(callback) {
  bundler(config.bundleConfigs.main)
  .on('end', callback);
});
