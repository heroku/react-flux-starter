'use strict';

var _ = require('lodash');

var BaseStore = require('./base');

var kActions = require('../constants/actions'),
    ServerActions = require('../actions/server-time');

var _actions = _.zipObject([
  [kActions.SERVERTIME_GET, 'handleSet'],
  [kActions.SERVERTIME_PUT, 'handleSet']
]);

class ServerTimeStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this._serverTime = undefined;
  }

  getActions() {
    return _actions;
  }

  _load() {
    ServerActions.getTime();
    return undefined;
  }

  _getTime() {
    return this._serverTime !== undefined ? this._serverTime : this._load();
  }

  getServerTime() {
    return this._getTime();
  }


  /*
  *
  * Action Handlers
  *
  */

  handleSet(payload) {
    console.debug(`${this.getStoreName()}:handleSet state=${payload.syncState}`);
    this._serverTime = this.makeStatefulEntry(payload.syncState, payload.data);
    this.emitChange();
  }

}

module.exports = ServerTimeStore;
