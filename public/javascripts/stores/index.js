'use strict';

var Dispatcher = require('../dispatcher');

var ItemsStore = require('./items'),
    ServerTimeStore = require('./server-time'),
    OverlaysStore = require('./overlays');

exports.initialize = function () {

  exports.ItemsStore = new ItemsStore(Dispatcher);
  exports.ServerTimeStore = new ServerTimeStore(Dispatcher);

  exports.OverlaysStore = new OverlaysStore(Dispatcher);

  return this;
};
