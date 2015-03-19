'use strict';

var _ = require('lodash');

var uuid = require('node-uuid');

var kActions = require('../constants/actions');
var kStates = require('../constants/states');

var ajax = require('../common/ajax');
var meteredGET = require('../common/metered-request').get;

var BaseAction = require('./base');

class CRUDBase extends BaseAction {

  constructor (baseURL, actionObjectId) {
    super();
    this.baseURL = baseURL;
    this.actionObjectId = actionObjectId;

    // explicitly bind handlers for web socket events
    _.bindAll(this, '_onPostEvent', '_onPutEvent', '_onDeleteEvent');
  }

  _actionForMethod(method) {
    return kActions[this.actionObjectId + '_' + method];
  }

  /**
   * GET list of resources
   * @method
   */
   getAll() {
     var action = this._actionForMethod('GETALL');
     meteredGET(
       this.baseURL,
       () => this.dispatchServerAction(action, kStates.LOADING),
       data => this.dispatchServerAction(action, kStates.SYNCED, data),
       err => this.dispatchServerAction(action, kStates.ERRORED, err)
     );
   }

   /**
    * POST (create) new resource
    * @method
    * @returns client generated UUID of the new resource
    */
   post(payload) {

     var action = this._actionForMethod('POST');

     payload.id = uuid.v1();

     ajax({
       url: this.baseURL,
       type: "POST",
       data: payload,
       accepts: {
         'json': "application/json",
         'text': 'text/plain'
       }
     })
     .then(function (data) {
       this.dispatchServerAction(action, kStates.SYNCED, data);
     }.bind(this))
     .catch(function (err) {
       this.dispatchServerAction(action, kStates.ERRORED, err);
     }.bind(this));

     this.dispatchServerAction(action, kStates.NEW, payload);

     return payload.id;
   }

   /**
    * GET a single resource
    * @method
    */
   get(id) {
     var action = this._actionForMethod('GETONE');
     meteredGET(
       `${this.baseURL}/${id}`,
       () => this.dispatchServerAction(action, kStates.LOADING, {id: id}),
       data => this.dispatchServerAction(action, kStates.SYNCED, data),
       err => this.dispatchServerAction(action, kStates.ERRORED, err)
     );
   }

   /**
    * PUT (update) a resource
    * @method
    */
   put(id, payload) {
     var action = this._actionForMethod('PUT');
     ajax({
       url: `${this.baseURL}/${id}`,
       type: "PUT",
       data: payload,
       accepts: {
         'json': "application/json",
         'text': 'text/plain'
       }
     })
     .then(function (data) {
       this.dispatchServerAction(action, kStates.SYNCED, data);
     }.bind(this))
     .catch(function (err) {
       this.dispatchServerAction(action, kStates.ERRORED, err);
     }.bind(this));

     this.dispatchServerAction(action, kStates.SAVING, payload);
   }

   /**
    * DELETE a resource
    * @method
    */
   delete(id) {
     var action = this._actionForMethod('DELETE');
     ajax({
       url: `${this.baseURL}/${id}`,
       type: "DELETE",
       accepts: {
         'json': "application/json",
         'text': 'text/plain'
       }
     })
     .then(function (data) {
       this.dispatchServerAction(action, kStates.SYNCED, data);
     }.bind(this))
     .catch(function (err) {
       this.dispatchServerAction(action, kStates.ERRORED, err);
     }.bind(this));

     this.dispatchServerAction(action, kStates.DELETING, {id: id});

   }


   /**
    *
    *  Subscription methods
    *
    */
  _onPostEvent(event, channel, data) {
    this.dispatchServerAction(this._actionForMethod('POST'), kStates.SYNCED, {
      subscription: this._normalizeChannelName(channel),
      id: data.id,
      data: data
    });
  }

  _onPutEvent(event, channel, data) {
    this.dispatchServerAction(this._actionForMethod('PUT'), kStates.SYNCED, {
      subscription: this._normalizeChannelName(channel),
      id: data.id,
      data: data
    });
  }

  _onDeleteEvent(event, channel) {
    var re = new RegExp(`${this.baseURL}/(.+)$`),  // re for extracing resource id from channel
        id = re.exec(channel)[1];

    this.dispatchServerAction(this._actionForMethod('DELETE'), kStates.SYNCED, {
      subscription: this._normalizeChannelName(channel),
      id: id
    });
  }

  subscribeList () {
    this._subscribe(this.baseURL, ['POST'], this._onPostEvent);
  }

  unsubscribeList () {
    this._unsubscribe(this.baseURL, ['POST'], this._onPostEvent);
  }

  subscribeResources(ids) {
    if (!_.isArray(ids)) {
      ids = [ids];
    }

    var channels = _.map(ids, id => `${this.baseURL}/${id}`);
    this._subscribe(channels, ['PUT'], this._onPutEvent);
    this._subscribe(channels, ['DELETE'], this._onDeleteEvent);
  }

  unsubscribeResources(ids) {
    if (!_.isArray(ids)) {
      ids = [ids];
    }

    var channels = _.map(ids, id => `${this.baseURL}/${id}`);
    this._unsubscribe(channels, ['PUT'], this._onPutEvent);
    this._unsubscribe(channels, ['DELETE'], this._onDeleteEvent);
  }

}

module.exports = CRUDBase;
