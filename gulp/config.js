'use strict';

var dest = './public/javascripts/bundles';

var vendorLibs = [
  'url',
  'util',
  'events',
  'lodash',
  'jquery',
  'bootstrap',
  'react',
  'react/addons',
  'react-router',
  'socket.io-client',
  'es6-promise',
  'moment',
  'node-uuid'
];

var es6ify = require('es6ify');
var reactify = require('reactify');

module.exports = {
  production: process.env.NODE_ENV === 'production',
  bootstrap: {
    bootstrapHome: 'node_modules/bootstrap',
    fonts: './public/fonts/bootstrap'
  },
  less: {
    src: './public/less/styles.less',
    watch: [
      './public/less/**'
    ],
    dest: './public/stylesheets'
  },
  browserify: {
    // Enable source maps
    debug: true,
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: {
      main: {
        entries: './public/javascripts/main.jsx',
        dest: dest,
        outputName: 'main.js',
        external: vendorLibs,
        transforms: [reactify, es6ify.configure(/\.jsx?$/)],
        watch: [
          'public/javascripts/**/*.js',
          'public/javascripts/**/*.jsx',
          '!public/javascripts/bundles/*.js',
          '!public/javascripts/vendor/**/*.js'
        ]
      },
      vendor: {
        entries: './public/javascripts/noop.js',
        dest: dest,
        outputName: 'vendor.js',
        require: vendorLibs,
        add: [es6ify.runtime]
      }
    }
  }
};
