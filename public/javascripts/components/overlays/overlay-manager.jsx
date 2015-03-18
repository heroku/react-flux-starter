'use strict';

var React = require('react/addons');

var Stores = require('../../stores'),
    storeChangeMixin = require('../../mixins/store-change');

/**
 * Basic manager for displaying overlays
 *
 * Only 1 overlay at a time can be displayed.
 *
 * Overlays are responsible for their own popping
 *
 */

module.exports = React.createClass({

  mixins: [storeChangeMixin(Stores.OverlaysStore)],

  storeChange: function () {
    this.forceUpdate();
  },

  render: function () {
    var overlay = Stores.OverlaysStore.getTopOverlay();
    if (!overlay) { return null; }
    return overlay;
  }

});
