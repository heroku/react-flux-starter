'use strict';

/* Notes:   ??? NEEDS TO BE UPDATED TO USE WATCHIFY
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp   = require('gulp');
var config = require('../config');

gulp.task('watch', ['build'], function() {
  gulp.watch(config.less.watch, ['less']);
  gulp.watch(config.browserify.bundleConfigs.main.watch, ['main.js']);
});
