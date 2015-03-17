'use strict';

var EventEmitter = require("events").EventEmitter;

var _ = require('lodash');
var io = require('socket.io-client');

var httpVerbRe = /^(GET|PUT|POST|DELETE)\s/;


class SubscriptionService extends EventEmitter {
  constructor(accessToken) {
    super();

    this.accessToken = accessToken;

    var socket = this.socket = io({transports:['websocket']});

    // attach handlers
    socket.on('connect', this.handleConnect.bind(this));
    socket.on('disconnect', this.handleDisconnect.bind(this));
    socket.on('reconnect', this.handleReconnect.bind(this));
    socket.on('set', this.handleSet.bind(this));

    //console.log(socket);
  }

  handleConnect(){
    this.socket.emit('auth', this.accessToken);
    this.emit('connect');
  }

  handleDisconnect(){
    this.emit('disconnect');
  }

  handleReconnect(){
    //console.debug('reconnect; attempts: ' + attempts);
    _.each(this._events, function(fn, channel){
      // on reconnect remove all API channel listeners
      if (httpVerbRe.test(channel)) {
        this.removeAllListeners(channel);
      }
    }, this);
    this.emit('reconnect');
  }

  handleSet(data){
    this.emit(data.channel, 'set', data.channel, JSON.parse(data.data));
  }

  subscribe(channel, handler, options){
    //console.log('subscribe', arguments);

    // only one subscription per channel
    if (EventEmitter.listenerCount(this, channel) !== 0) {
      throw new Error('api-subscription: Cannot subscribe to channel "' + channel + '" more than once.');
    }

    options = _.extend({
      initialPayload: false,
      // deprecated
      reconnectPayload: false
    }, options || {});

    handler._options = options;

    this.addListener(channel, handler);
    this.socket.emit('subscribe', channel, options.initialPayload);

    return this;
  }

  unsubscribe(channel, handler){
    //console.log('unsubscribe', arguments);

    this.removeListener(channel, handler);

    // if there's no more handlers for this channel, unsubscribe from it completely
    if (EventEmitter.listenerCount(this, channel) === 0) {
      this.socket.emit('unsubscribe', channel);
    }
    return this;
  }

  normalizeChannelName(channel){
    return channel.replace(/^(GET|PUT|POST|DELETE)\s/, '');
  }

  isConnected(){
    return this.socket.connected;
  }

  isDisconnected(){
    return this.socket.disconnected;
  }
}


module.exports = function (accessToken) {
  return new SubscriptionService(accessToken);
};
