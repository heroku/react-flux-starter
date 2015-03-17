'use strict';

var kActions = require('../constants/actions');
var kStates = require('../constants/states');

var meteredGET = require('../common/metered-request').get;

var BaseAction = require('./base');

class ItemActions extends BaseAction {

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
  _onUpdateHandler (event, channel, data) {
    this.dispatchServerAction(kActions.SERVERTIME_PUT, kStates.SYNCED, data);
  }

  subscribe() {
    var channels = ['/api/servertime'];
    this._subscribe(channels, ['PUT'], this._onUpdateHandler.bind(this));
  }

  unsubscribe() {
    var channels = ['/api/servertime'];
    this._unsubscribe(channels, ['PUT'], this._onUpdateHandler.bind(this));
  }

}

module.exports = new ItemActions();
