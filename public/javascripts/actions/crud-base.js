'use strict';

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

}

module.exports = CRUDBase;
