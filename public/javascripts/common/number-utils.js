'use strict';

var re = /\B(?=(\d{3})+(?!\d))/g;

module.exports = {
  numberWithCommas: function (x, defaultValue='-') {
    if (!x) { return defaultValue; }
    return x.toString().replace(re, ",");
  },

  formatTimeForInterval: function (timestamp, interval="hour") {
    var result;
    switch (interval) {
    case "day":
      result = timestamp.format("ddd, MMM D, YYYY");
      break;
    case "hour":
      result = timestamp.format("ddd, MMM D, YYYY, h:mm A");
      break;
    default:
      // default is "minute"
      result = timestamp.format("ddd, MMM D, YYYY, h:mm:ss A");
    }
    return result;
  }
};
