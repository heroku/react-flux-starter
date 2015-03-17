'use strict';

var _ = require('lodash');

var url = require('url'),
    http = require('http'),
    //fernet = require('fernet'),
    socketio = require('socket.io');

/*
var _fernet = new fernet({ttl: 0});

if (!process.env.FERNET_KEY) {
  throw "FERNET_KEY missing";
}
var secret = new fernet.Secret(process.env.FERNET_KEY);

function fernetDecode(ciphertext) {
  if (!ciphertext) {
    throw "Cannot Fernet decode, ciphertext is null";
  }
  var token = new _fernet.Token({
    secret: secret,
    token: ciphertext
  });
  return token.decode();
}
*/

// auth: parsedUrl.auth ? parsedUrl.auth.split(':')[1] : null
// redis://:@localhost:6379/

/*
var parsedUrl = url.parse(process.env.REDIS_URL || process.env.REDISGREEN_URL);

var redis = require("redis");
*/

var _subscriptions = {};

module.exports = function (server) {

  var io = socketio(server);
  //var redisClient = redis.createClient(parsedUrl.port || 6379, parsedUrl.hostname || 'localhost');

  function unsubscribe(socket, channel) {
    console.log('unsubscribing from ' + channel);
    // Get listeners for channel.  Remove socket for list.  If
    // channel listeners becomes empty then unsubscribe from redis
    // channel and remove channel from internal subsciptions hash
    var channelListeners = _subscriptions[channel];
    if (channelListeners) {
      channelListeners.splice(_.indexOf(channelListeners, socket), 1);
      if (channelListeners.length === 0) {
        //redisClient.unsubscribe(channel);
        delete _subscriptions[channel];
      }
    }
  }

  /*
  redisClient.auth(parsedUrl.auth ? parsedUrl.auth.split(':')[1] : null, function () {
    console.log('redisClient.auth callback');
  });

  redisClient.on("error", function (err) {
    console.error("Error " + err);
  });

  redisClient.on("ready", function () {
    console.log('redis client: ready');
  });

  redisClient.on("connect", function () {
    console.log('redis client: connect');
  });

  redisClient.on("end", function () {
    console.log('redis client: end');
  });

  redisClient.on("drain", function () {
    console.log('redis client: drain');
  });

  redisClient.on("idle", function () {
    console.log('redis client: idle');
  });

  redisClient.on("message", function (channel, message) {
    //message = fernetDecode(message);
    var channelListeners = _subscriptions[channel] || [];
    if (channelListeners.length === 0) { console.warn('no listeners for channel: ' + channel); }
    _.each(channelListeners, function (socket) {
      socket.emit('set', {channel: channel, data: message});
    });
  });
  */

  io.on('connection', function(socket) {

    var interval;

    console.log('socket connection established');

    socket.on('disconnect', function() {
      console.log('socket disconnected - cleanup');
      // remove socket from any subscriptions
      _.each(_subscriptions, function(sockets, channel){
        if (_.indexOf(sockets, socket) !== -1) {
          unsubscribe(socket, channel);
        }
      });
    });

    socket.on('auth', function(accessToken) {
      console.log('socket auth set');
      socket.accessToken = accessToken;
    });

    socket.on('subscribe', function (channel, withResponse) {

      /*
      * ??? ONLY FOR EXAMPLE to simulate subscription to /api/servertime
      * To use redis and remove this HARDCODED /api/servertime example
      * remove the following lines through the return
      *
      */

      console.log('initiate subscription to %s', channel);

      // Get or create listeners list for channel
      var channelListeners = _subscriptions[channel] || (_subscriptions[channel] = []);

      // Only add client socket once to channel listeners
      if (_.indexOf(channelListeners, socket) !== -1) {
        console.error('Attempt to subscribe to channel already subscribed to - channel: %s, socket: %j', channel, socket);
        return;
      }
      channelListeners.push(socket);

      socket.emit('set', {channel: channel, data: JSON.stringify(new Date().toString())});
      console.log('refreshing on subscribe: ' + channel);
      console.log('subscribed to ' + channel);

      interval = setInterval(function () {
        socket.emit('set', {channel: channel, data: JSON.stringify(new Date().toString())});
      }, 1000);

      return;

      /*
      * ??? FOR REDIS below only pertains to redis pubsub bridge.  If you use the redis
      * remove everything above and use the impl below
      */

      if (!socket.accessToken) {
        console.log('cannot subscribe to a channel without an access token');
        return;
      }

      console.log('initiate subscription to %s', channel);

      var options = {
        hostname: 'localhost',
        port: process.env.DJANGO_PORT,
        path: channel.replace(/^(GET|PUT|POST|DELETE)\s/, ''),
        headers: {
          Authorization: "Heroku " + socket.accessToken,
          'X-Forwarded-Proto': 'https'
        }
      };

      var successHandler;

      if (withResponse) {
        options.method = 'GET';
        successHandler = function(body) {
          socket.emit('set', {channel: channel, data: body});
          console.log('refreshing on subscribe: ' + channel);
          console.log('subscribed to ' + channel);
        };
      }
      else {
        options.method = 'HEAD';
        successHandler = function() {
          console.log('subscribed to ' + channel);
        };
      }

      var req = http.request(options, function(res) {
        if (res.statusCode === 200) {

          // Get or create listeners list for channel
          var channelListeners = _subscriptions[channel] || (_subscriptions[channel] = []);
          // If no listeners exist, subscribe to redis channel
          if (channelListeners.length === 0) {
            //redisClient.subscribe(channel);
          }
          // Only add client socket once to channel listeners
          if (_.indexOf(channelListeners, socket) !== -1) {
            console.error('Attempt to subscribe to channel already subscribed to - channel: %s, socket: %j', channel, socket);
            return;
          }
          channelListeners.push(socket);

          // we have to consume the response data always
          // or the 'end' event never fires, and sockets
          // will remain tied up in the pool for longer
          var body = '';
          res.setEncoding('utf8');
          res.on('data', function(chunk) {
            body += chunk;
          });
          res.on('end', function() {
            successHandler(body);
          });
        } else {
          console.log('failed subscribing to %s; statusCode: %d', channel, res.statusCode);
        }
      });
      req.on('error', function(e) {
        console.log('problem with subscription auth request: ' + e.message);
      });
      req.end();

    });

    socket.on('unsubscribe', function (channel) {
      unsubscribe(socket, channel);

      /*
      * ??? ONLY FOR EXAMPLE to simulate subscription to /api/servertime
      *remove if using redis
      */
      clearInterval(interval);
    });

  });

  return io;
};
