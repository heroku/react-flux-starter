/**
 *  Wrapper for $.ajax() that returns ES6 promises instead
 *  of jQuery promises.
 *  @module common/ajax
 */

'use strict';

var $ = require('jquery');

var HTTPError = require('./http-error');


module.exports = function(opts) {
  var promise = new Promise(function(resolve, reject) {
    $.ajax(opts)
    .done(function(data) {
      resolve(data);
    })
    .fail(function(xhr, status, err) {
      var response;
      if (xhr.status === 0 && xhr.responseText === undefined) {
        response = {detail:'Possible CORS error; check your browser console for further details'};
      }
      else {
        response = xhr.responseJSON;
      }

      reject(new HTTPError(opts.url, xhr, status, err, response));
    });
  });

  return promise;
};
