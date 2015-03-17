'use strict';

var validator = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

module.exports = {
  isValidEmail: function (s) {
    return validator.test(s);
  }
};
