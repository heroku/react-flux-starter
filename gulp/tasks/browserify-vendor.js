'use strict';

var gulp = require('gulp');
var config = require('../config').browserify;
var bundler = require('../util/bundler');

gulp.task('vendor.js', function(callback) {
  bundler(config.bundleConfigs.vendor)
  .on('end', callback);
});
