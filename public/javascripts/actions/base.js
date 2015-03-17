/** @module actions/base */

'use strict';

var _ = require('lodash');
var Dispatcher = require('../dispatcher');

var apiSubscriptionSrvc = require('../services/index').apiSubscriptions;

var kState = require('../constants/states');

module.exports = class Actions {

  constructor () {
    this._dispatcher = Dispatcher;
  }

  /**
    * Standard Dispatcher payload
    *
    * @property {integer} actionType - action type from constants/actions
    * @property {integer} syncState - sync state with server from contants/states
    * @property {object} data - payload data (to be interpreted based on actionType & state)
    *
    */
  _makePayload (action, syncState, data) {
    return {
      actionType: action,
      syncState: syncState,
      data: data
    };
  }

  /**
   * Set _meta_state property to SYNCED in all contained entities
   * @method _setMetaState
   * @param {object} normalizedData - server response which has been normalized with normalizr
   */
  _setMetaState (normalizedData, metaState = kState.SYNCED) {
    _.each(normalizedData.entities, function (entities) {
      _.each(entities, function (entity) {
        entity._meta_state = metaState;
      });
    });

    return normalizedData;
  }

  /**
   * Generate list of physical channels
   * @method _getPhysicalChannels
   * @param {array} channels
   * @param {array} methods
   */
  _getPhysicalChannels (channels, methods) {
    return _.flatten(channels.map(function (channel) {
      return methods.map(function (method) {
        return method + ' ' + channel;
      });
    }));
  }

  /** Subscribe to channel.
    * @method _subscribe
    * @param {string|array} channels - String or array of channel names.
    * @param {array} methods
    * @param {function} handler - Handler to be called when event on channel occurs
    */
  _subscribe (channels, methods, handler, options) {

    if (_.isString(channels)) {
      channels = [channels];
    }

    if (!_.isArray(methods)) {
      throw new Error('methods argument must be array of HTTP methods');
    }

    _.each(this._getPhysicalChannels(channels, methods), function (channel) {
      apiSubscriptionSrvc.subscribe(channel, handler, options);
    });

  }

  /** Unsubscribe from channel.
    * @method _unsubscribe
    * @param {string|array} channels - String or array of channel names.
    * @param {array} methods
    * @param {function} handler - Handler to be called when event on channel occurs
    */
  _unsubscribe (channels, methods, handler) {

    if (_.isString(channels)) {
      channels = [channels];
    }

    if (!_.isArray(methods)) {
      throw new Error('methods argument must be array of HTTP methods');
    }

    _.each(this._getPhysicalChannels(channels, methods), function (channel) {
      apiSubscriptionSrvc.unsubscribe(channel, handler);
    });

  }

  /** Clean leading HTTP verbs from a channel name.
   * @method _normalizeChannelName
   * @param {string} channel
   */
  _normalizeChannelName(channel){
    return apiSubscriptionSrvc.normalizeChannelName(channel);
  }

  _checkDispatchArgs (action, syncState) {
    if (action === undefined) {
      throw new Error(`action argument value of undefined passed to dispatchUserAction.  You're most likely referencing an invalid Action constant (constants/actions.js).`);
    }
    if (syncState === undefined) {
      throw new Error(`syncState argument value of undefined passed to dispatchUserAction.  You're most likely referencing an invalid State constant (constants/state.js).`);
    }
  }
  /** Dispatch server action.
   * @method dispatchServerAction
   * @param {integer} actionType - action type from constants/actions
   * @param {integer} syncState - sync state with server; one of SYNCED, REQUEST, ERRORED from contants/states
   * @param {object} data - payload data (to be interpreted based on actionType & state)
   */
  dispatchServerAction (action, syncState, data) {
    this._checkDispatchArgs(action, syncState);
    try {
      this._dispatcher.handleServerAction(this._makePayload(action, syncState, data));
    }
    catch (err) {
      console.error(err.stack);
    }
  }

  /** Dispatch user action.
   * @method dispatchUserAction
   * @param {integer} actionType - action type from constants/actions
   * @param {integer} syncState - sync state with server; one of SYNCED, REQUEST, ERRORED from contants/states
   * @param {object} data - payload data (to be interpreted based on actionType & state)
   */
  dispatchViewAction (action, syncState, data) {
    this._checkDispatchArgs(action, syncState);
    try {
      this._dispatcher.handleViewAction(this._makePayload(action, syncState, data));
    }
    catch (err) {
      console.log(err.stack);
    }
  }

};
