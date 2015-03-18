'use strict';

var _ = require('lodash');

var kActions = require('../constants/actions');
var kStates = require('../constants/states');

var meteredGET = require('../common/metered-request').get;

var BaseAction = require('./base');

class ItemActions extends BaseAction {

  constructor () {
    super();

    // explicitly bind handlers for web socket events
    _.bindAll(this, '_onPut');
  }

  // GET the time on the server
  getTime() {
    meteredGET(
      '/api/servertime',
      () => this.dispatchServerAction(kActions.SERVERTIME_GET, kStates.LOADING),
      data => this.dispatchServerAction(kActions.SERVERTIME_GET, kStates.SYNCED, data),
      err => this.dispatchServerAction(kActions.SERVERTIME_GET, kStates.ERRORED, err)
    );
  }


 /**
  *
  * Server-time real-time subscription methods
  *
  */
  _onPut (event, channel, data) {
    this.dispatchServerAction(kActions.SERVERTIME_PUT, kStates.SYNCED, data);
  }

  subscribe() {
    var channels = ['/api/servertime'];
    this._subscribe(channels, ['PUT'], this._onPut);
  }

  unsubscribe() {
    var channels = ['/api/servertime'];
    this._unsubscribe(channels, ['PUT'], this._onPut);
  }

}

module.exports = new ItemActions();
