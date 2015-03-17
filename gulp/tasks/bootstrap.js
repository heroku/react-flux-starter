'use strict';

var gulp = require('gulp'),
    path = require('path'),
    config = require('../config').bootstrap;


// copy bootstrap fonts into the public folder
gulp.task('bootstrap', function () {

  /* BOOTSTRAP */

  // copy over all the fonts
  gulp.src(path.join(config.bootstrapHome, 'fonts/**/*'))
    .pipe(gulp.dest(config.fonts));

});
