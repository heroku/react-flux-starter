'use strict';

var _ = require('lodash');

var BaseStore = require('./base');

var kActions = require('../constants/actions'),
    kStates = require('../constants/states');


function _actionForMethod(actionObjectId, method) {
  return kActions[actionObjectId + '_' + method];
}

class CRUDStore extends BaseStore {

  constructor(dispatcher, actions, actionObjectId) {
    super(dispatcher);

    this._actions = actions;

    this._resources = undefined;

    this._handlers = _.zipObject([
      [_actionForMethod(actionObjectId, 'GETALL'), '_onGetAll'],
      [_actionForMethod(actionObjectId, 'GETONE'), '_onGetOne'],
      [_actionForMethod(actionObjectId, 'POST'), '_onPost'],
      [_actionForMethod(actionObjectId, 'PUT'), '_onPut'],
      [_actionForMethod(actionObjectId, 'DELETE'), '_onDelete']
    ]);
  }

  /**
   * Get array of all resources
   */
  getAll() {
    return this._resources !== undefined ? _.map(this._resources, resource => resource) : this._loadAll();
  }

  /**
   * Get single resource
   */
  get(id) {
    id = parseInt(id, 10);
    return this._resources !== undefined ? (id in this._resources ? this._resources[id] : this._loadOne(id)) : this._loadAll();
  }

  _getActions() {
    return this._handlers;
  }

  /**
   * Utility methods
   */
  _loadAll() {
    this._actions.getAll();
    return undefined;
  }

  _loadOne(id) {
    this._actions.get(id);
    return undefined;
  }

  /**
   *
   * Action Handlers
   *
   */
  _onGetAll(payload) {
    console.debug(`${this.getStoreName()}:_onGetAll; state=${payload.syncState}`);

    switch(payload.syncState) {
      case kStates.LOADING:
        this.inflight = true;
        break;
      case kStates.SYNCED:
        this._resources = _.zipObject(_.map(payload.data, item => [item.id, this.makeStatefulEntry(payload.syncState, item)]));
        this.inflight = false;
        break;
    }

    this.emitChange();
  }

  _onGetOne(payload) {

    console.debug(`${this.getStoreName()}:_onGetAll; state=${payload.syncState}`);

    switch(payload.syncState) {
      case kStates.LOADING:
        this.inflight = true;
        break;
      case kStates.SYNCED:
        this._resources = this._resources || {};
        this._resources[payload.data.id] = this.makeStatefulEntry(payload.syncState, payload.data);
        this.inflight = false;
        break;
    }

    this.emitChange();

  }

  _onPost(payload) {
    console.debug(`${this.getStoreName()}:_onPost; state=${payload.syncState}`);

    if (!this._resources) { this._resources = {}; }

    this._resources[payload.data.id] = this.makeStatefulEntry(payload.syncState, payload.data);

    this.emitChange();
  }

  _onPut(payload) {
    console.debug(`${this.getStoreName()}:_onPut; state=${payload.syncState}`);

    if (!this._resources) { this._resources = {}; }

    var existingEntry = this._resources[payload.data.id];

    // can only update an entry we know about ???
    if (!existingEntry) {
      return;
    }

    this._resources[payload.data.id] = this.updateStatefulEntry(existingEntry, payload.syncState, payload.data);

    this.emitChange();
  }

  _onDelete(payload) {
    console.debug(`${this.getStoreName()}:_onDelete; state=${payload.syncState}`);

    if (!this._resources) { this._resources = {}; }

    var existingEntry = this._resources[payload.data.id];

    // can only delete an entry we know about
    if (!existingEntry) {
      return;
    }

    if (existingEntry) {
      switch(payload.syncState) {
        case kStates.DELETING:
          existingEntry = this.updateStatefulEntry(existingEntry, payload.syncState);
          break;
        case kStates.SYNCED:
          delete this._resources[payload.data.id];
          break;
      }

      this.emitChange();
    }
  }

}

module.exports = CRUDStore;
