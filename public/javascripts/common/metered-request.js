/** @module common/metered-request */

'use strict';


/*
*
* Allows only 1 request for a method/url to occur at a time.  Requests for the same resource
* are folded into the outstanding request by returning its Promise.
*
*/

var _ = require('lodash');
var ajax = require('./ajax');

// Dictionary that holds in-flight requests.  Maps request url to promise.
var _inFlightRequests = {};

module.exports = {

  /** GET JSON resource from API endpoint.
   *  If request is already pending, will return the existing promise.
   *  @method get
   *  @param {string or object} url | settings - either:
   *      a string containing the URL to which the request is sent or
   *      a set of key/value pairs that configure the Ajax request
   *  @returns {Promise}
   */
  get: function (settings, startHdlr, resolveHdlr, rejectHdlr, apiOpts) {
    var url;
    var promise;

    if (_.isString(settings)) {
      url = settings;
      settings = {
        url: url,
        contentType : 'application/json',
        type : 'GET'
      };
    }
    else {
      url = settings.url;
      settings = _.extend({}, settings, {
        contentType : 'application/json',
        type : 'GET'
      });
    }

    if (!_.isString(url)) {
      throw new Error('metered-request::get - URL argument is not a string');
    }

    // request already in flight, return its promise
    if (url in _inFlightRequests) {
      //console.debug('Returning pending metered request for: ' + url);
      promise = _inFlightRequests[url];
      promise._isNew = false;
      return promise;
    }

    //console.debug('Creating new metered request for: ' + url);

    // create a new promise to represent the GET.  GETs are always
    // initiated in the nextTick to prevent dispatches during dispatches
    //
    promise = new Promise(function (resolve, reject) {

      process.nextTick(function () {

        ajax(settings, apiOpts)
        .then(function (data) {
          delete _inFlightRequests[url];
          resolveHdlr(data);
          resolve(data);
        }, function (err) {
          delete _inFlightRequests[url];
          rejectHdlr(err);
          reject(err);
        });

        startHdlr();
      });
    });

    promise.catch(function () {
      // no-op catch handler to prevent "unhandled promise rejection" console messages
    });

    // Add a custom property to assert that a AJAX request
    // was make and a Promise created as part of this call.
    // This is used as a hint to callers to create resolve/reject
    // handlers or not (i.e. don't add more resolve/reject handlers
    // if the Promise is for a pending request)
    promise._isNew = true;

    // record request
    _inFlightRequests[url] = promise;

    return promise;
  }

};
