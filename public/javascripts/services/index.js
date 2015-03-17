'use strict';

var apiSubscriptionSrvc = require('./api-subscriptions');

exports.initialize = function (accessToken) {
  exports.apiSubscriptions = apiSubscriptionSrvc(accessToken);
};
