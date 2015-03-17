'use strict';

var Dispatcher = require('../dispatcher');

var ItemsStore = require('./items'),
    ServerTimeStore = require('./server-time');


exports.initialize = function () {
  exports.ItemsStore = new ItemsStore(Dispatcher);
  exports.ServerTimeStore = new ServerTimeStore(Dispatcher);

  return this;
};
