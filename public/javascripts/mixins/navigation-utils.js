'use strict';

var History = require('react-router').History;

module.exports = {

  backOrTransitionTo: function (routeName, params) {
    if (History.length > 1) {
      this.goBack();
    }
    else {
      this.transitionTo(routeName, params);
    }
  }

};
