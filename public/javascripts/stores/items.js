'use strict';

var _ = require('lodash');

var BaseStore = require('./base');

var kActions = require('../constants/actions'),
    kStates = require('../constants/states'),
    ItemActions = require('../actions/items');

var _actions = _.zipObject([
  [kActions.ITEM_GETALL, 'handleSetAll'],
  [kActions.ITEM_POST, 'handleEntryCreate'],
  [kActions.ITEM_PUT, 'handleEntryUpdate'],
  [kActions.ITEM_DELETE, 'handleEntryDelete']
]);

class ItemsStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this._items = undefined;
  }

  getActions() {
    return _actions;
  }

  _load() {
    ItemActions.getAll();
    return undefined;
  }

  _getItems() {
    return this._items !== undefined ? this._items : this._load();
  }

  getAll() {
    return this._getItems();
  }

  get(id) {
    id = parseInt(id, 10);
    return this._items !== undefined ? (id in this._items ? this._items[id] : null) : this._load();
  }

  /*
  *
  * Action Handlers
  *
  */

  handleSetAll(payload) {
    console.debug(`${this.getStoreName()}:handleSetAll; state=${payload.syncState}`);

    switch(payload.syncState) {
      case kStates.LOADING:
        this.inflight = true;
        break;
      case kStates.SYNCED:
        this._items = _.each(payload.data, item => this.makeStatefulEntry(payload.syncState, item));
        this.inflight = false;
        break;
    }

    this.emitChange();
  }

  handleEntryCreate(payload) {
    console.debug(`${this.getStoreName()}:handleEntryCreate; state=${payload.syncState}`);

    var state = this._items || {},
        newEntry, existingEntry;

    switch(payload.syncState) {
      case kStates.NEW:
        state[payload.data.cid] = this.makeStatefulEntry(payload.syncState, payload.data);
        break;
      case kStates.SYNCED:
        newEntry = payload.data;
        // check for a local client id and switch to server id
        // ??? is this best done here or encapsulated in Entry Model ???
        if (newEntry.cid && (existingEntry = state[newEntry.cid]) && !state[newEntry.id]) {

          console.debug(`${this.getStoreName()}:handleEntryCreate; converting client-id to server-id`);

          existingEntry = this.updateStatefulEntry(existingEntry, payload.syncState, newEntry);

          // remove the "new" entry which is being replaced by its permanent one
          delete state[existingEntry.data.cid];
          state[existingEntry.data.id] = existingEntry;
        }
        else {
          state[newEntry.id] = this.makeStatefulEntry(payload.syncState, newEntry);
        }
        break;
    }

    this.emitChange();
  }

  handleEntryUpdate(payload) {
    console.debug(`${this.getStoreName()}:handleEntryUpdate; state=${payload.syncState}`);

    var newEntry = payload.data,
        existingEntry;

    switch(payload.syncState) {
      case kStates.SAVING:
        existingEntry = this._items[newEntry.id];
        if (existingEntry) {
          existingEntry = this.updateStatefulEntry(existingEntry, payload.data, newEntry);
        }
        break;
      case kStates.SYNCED:
        existingEntry = this._items[newEntry.id];
        if (existingEntry) {
          existingEntry = this.updateStatefulEntry(existingEntry, payload.data, newEntry);
        }
        break;
    }

    this.emitChange();
  }

  handleEntryDelete(payload) {
    console.debug(`${this.getStoreName()}:handleEntryDelete; state=${payload.syncState}`);

    var existingEntry = this._items[payload.data.id];

    if (existingEntry) {
      switch(payload.syncState) {
        case kStates.DELETING:
          existingEntry = this.updateStatefulEntry(existingEntry, payload.syncState);
          break;
        case kStates.SYNCED:
          delete this._items[payload.data.id];
          break;
      }

      this.emitChange();
    }
  }

}

module.exports = ItemsStore;
