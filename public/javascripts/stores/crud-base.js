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

    this._resources = undefined;

    this._actions = actions;
    this._handlers = this._getActionHandlers(actionObjectId);

    // subscribe the store to the 'getAll' list endpoint
    actions.subscribeList();
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
    return this._resources !== undefined ? (id in this._resources ? this._resources[id] : this._loadOne(id)) : this._loadAll();
  }


  /**
   * Support for defining and getting action handler map
   */
  _getActions() {
    return this._handlers;
  }

  _getActionHandlers(actionObjectId) {
    return _.zipObject([
      [_actionForMethod(actionObjectId, 'GETALL'), '_onGetAll'],
      [_actionForMethod(actionObjectId, 'GETONE'), '_onGetOne'],
      [_actionForMethod(actionObjectId, 'POST'), '_onPost'],
      [_actionForMethod(actionObjectId, 'PUT'), '_onPut'],
      [_actionForMethod(actionObjectId, 'DELETE'), '_onDelete']
    ]);
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

        // unsubscribe from resource websocket events if we already have resources
        if (this._resources) {
          this._actions.unsubscribeResources(_.map(this._resources, resource => resource.data.id));
        }

        // subscribe to resource websocket events
        var map = _.map(payload.data, item => [item.id, this.makeStatefulEntry(payload.syncState, item)]);
        this._resources = _.zipObject(map);

        this._actions.subscribeResources(_.map(this._resources, resource => resource.data.id));

        this.inflight = false;
        break;
    }

    this.emitChange();
  }

  _onGetOne(payload) {
    console.debug(`${this.getStoreName()}:_onGetAll; state=${payload.syncState}`);

    var exists;

    switch(payload.syncState) {
      case kStates.LOADING:
        this.inflight = true;
        break;
      case kStates.SYNCED:
        this._resources = this._resources || {};
        exists = !!this._resources[payload.data.id];
        this._resources[payload.data.id] = this.makeStatefulEntry(payload.syncState, payload.data);
        // only subscribe to resource websocket events if the resource is new
        if (!exists) {
          this._actions.subscribeResources(payload.data.id);
        }
        this.inflight = false;
        break;
    }

    this.emitChange();

  }

  _onPost(payload) {
    console.debug(`${this.getStoreName()}:_onPost; state=${payload.syncState}`);

    if (!this._resources) { this._resources = {}; }

    this._resources[payload.data.id] = this.makeStatefulEntry(payload.syncState, payload.data);

    // subscribe to resource only on SYNC
    if (payload.syncState === kStates.SYNCED) {
      this._actions.subscribeResources(payload.data.id);
    }

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
          // unsubscribe from resource
          this._actions.unsubscribeResources(payload.data.id);
          delete this._resources[payload.data.id];
          break;
      }

      this.emitChange();
    }
  }

}

module.exports = CRUDStore;
