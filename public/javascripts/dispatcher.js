'use strict';

var _ = require('lodash');
var Dispatcher = require('./vendor/flux/Dispatcher');

module.exports = _.extend(new Dispatcher(), {

  /**
   * A bridge function between the views and the dispatcher, marking the action
   * as a view action.
   * @param  {object} action The data coming from the view.
   */
  handleViewAction: function(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },

  /**
   * A bridge function between the server and the dispatcher, marking the action
   * as a server action.
   * @param  {object} action The data coming from the view.
   */
  handleServerAction: function(action) {
    this.dispatch({
      source: 'SERVER_ACTION',
      action: action
    });
  }

});
