'use strict';

var _ = require('lodash');

var StoreChangeMixin = function() {
  var args = Array.prototype.slice.call(arguments);

  return {

    componentWillMount: function() {
      if (!_.isFunction(this.storeChange)) {
        throw new Error('StoreChangeMixin requires storeChange handler');
      }

      _.each(args, function(store) {
        store.addChangeListener(this.storeChange);
      }, this);
    },

    componentWillUnmount: function() {
      _.each(args, function(store) {
        store.removeChangeListener(this.storeChange);
      }, this);
    }

  };
};

StoreChangeMixin.componentWillMount = function() {
  throw new Error("StoreChangeMixin is a function that takes one or more " +
    "store names as parameters and returns the mixin, e.g.: " +
    "mixins[StoreChangeMixin(store1, store2)]");
};

module.exports = StoreChangeMixin;
