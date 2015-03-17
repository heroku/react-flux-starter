'use strict';

var browserify = require('browserify');
var watchify = require('watchify');
var bundleLogger = require('./bundleLogger');
var gulp = require('gulp');
var handleErrors = require('./handleErrors');
var source = require('vinyl-source-stream');
var config = require('../config').browserify;

module.exports = function(bundleConfig) {

  var bundler = browserify({
    // Required watchify args
    cache: {}, packageCache: {}, fullPaths: false,
    // Specify the entry point of your app
    entries: bundleConfig.entries,
    // Add file extentions to make optional in your requires
    extensions: config.extensions,
    // Enable source maps!
    debug: config.debug
  });

  if (bundleConfig.add) {
    bundleConfig.add.forEach(function(lib) { bundler.add(lib); });
  }

  if (bundleConfig.require) {
    bundleConfig.require.forEach(function(lib) { bundler.require(lib); });
  }

  if (bundleConfig.external) {
    bundleConfig.external.forEach(function(lib) { bundler.external(lib); });
  }

  if (bundleConfig.transforms) {
    bundleConfig.transforms.forEach(function(transform) { bundler.transform(transform); });
  }

  var bundle = function() {
    // Log when bundling starts
    bundleLogger.start(bundleConfig.outputName);

    return bundler
      .bundle()
      // Report compile errors
      .on('error', handleErrors)
      // Use vinyl-source-stream to make the
      // stream gulp compatible. Specifiy the
      // desired output filename here.
      .pipe(source(bundleConfig.outputName))
      // Specify the output destination
      .pipe(gulp.dest(bundleConfig.dest))
      .on('end', reportFinished);
  };

  if(global.isWatching) {
    // Wrap with watchify and rebundle on changes
    bundler = watchify(bundler);
    // Rebundle on update
    bundler.on('update', bundle);
  }

  var reportFinished = function() {
    // Log when bundling completes
    bundleLogger.end(bundleConfig.outputName);
  };

  return bundle();
};
