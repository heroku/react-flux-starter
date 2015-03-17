'use strict';

var kActions = require('../constants/actions');
var kStates = require('../constants/states');

var ajax = require('../common/ajax');
var meteredGET = require('../common/metered-request').get;

var BaseAction = require('./base');

// used for generating client-side ids for new entries
var _cid = 0;

class ItemActions extends BaseAction {

  // GET the list of all items
  getAll() {
    meteredGET(
      '/api/items',
      () => this.dispatchServerAction(kActions.ITEM_GETALL, kStates.LOADING),
      data => this.dispatchServerAction(kActions.ITEM_GETALL, kStates.SYNCED, data),
      err => this.dispatchServerAction(kActions.ITEM_GETALL, kStates.ERRORED, err)
    );
  }

  // POST (create) a new item
  requestCreateEntry (first, last) {
    // generate a client id so we can connect the dots when the server responds with
    // the permanent id
    var cid = 'c' + (_cid += 1),
        payload = { cid: cid, first: first, last: last };

    ajax({
      url: "/api/items",
      type: "POST",
      data: payload,
      accepts: {
        'json': "application/json",
        'text': 'text/plain'
      }
    })
    .then(function (data) {
      this.dispatchServerAction(kActions.ITEM_POST, kStates.SYNCED, data);
    }.bind(this))
    .catch(function (err) {
      this.dispatchServerAction(kActions.ITEM_POST, kStates.ERRORED, err);
    }.bind(this));

    this.dispatchServerAction(kActions.ITEM_POST, kStates.NEW, payload);
  }

  // GET a single item
  requestGetEntry (id) {
    meteredGET(
      `/api/items/${id}`,
      () => this.dispatchServerAction(kActions.ITEM_GET, kStates.LOADING, {id: id}),
      data => this.dispatchServerAction(kActions.ITEM_GET, kStates.SYNCED, data),
      err => this.dispatchServerAction(kActions.ITEM_GET, kStates.ERRORED, err)
    );
  }

  // PUT (update) a single item
  requestUpdateEntry (id, first, last) {
    var payload = {
      id: id,
      first: first,
      last: last
    };

    ajax({
      url: `/api/items/${id}`,
      type: "PUT",
      data: payload,
      accepts: {
        'json': "application/json",
        'text': 'text/plain'
      }
    })
    .then(function (data) {
      this.dispatchServerAction(kActions.ITEM_PUT, kStates.SYNCED, data);
    }.bind(this))
    .catch(function (err) {
      this.dispatchServerAction(kActions.ITEM_PUT, kStates.ERRORED, err);
    }.bind(this));

    this.dispatchServerAction(kActions.ITEM_PUT, kStates.SAVING, payload);
  }

  // DELETE a single item
  requestDeleteEntry (id) {
    ajax({
      url: `/api/items/${id}`,
      type: "PUT",
      accepts: {
        'json': "application/json",
        'text': 'text/plain'
      }
    })
    .then(function (data) {
      this.dispatchServerAction(kActions.ITEM_DELETE, kStates.SYNCED, data);
    }.bind(this))
    .catch(function (err) {
      this.dispatchServerAction(kActions.ITEM_DELETE, kStates.ERRORED, err);
    }.bind(this));

    this.dispatchServerAction(kActions.ITEM_DELETE, kStates.DELETING, {id: id});

  }
}

module.exports = new ItemActions();
