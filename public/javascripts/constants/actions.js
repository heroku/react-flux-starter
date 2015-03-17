'use strict';

var keyMirror = require('react/lib/keyMirror');

/**
 * Action type constants. Should follow the format:
 * <OBJECT ALIAS>_<VERB>
 *
 * For example, an action for fetching a specific "Item" object:
 * ITEM_GET
 *
 * Actions verbs should typically use one of the following:
 * GET                      <- Retrieving a list of objects. (e.g. GET /items)
 * POST                     <- Creating an object. (e.g. POST /items)
 * PUT                      <- Update an existing object. (e.g. PUT /items/:id)
 * DELETE                   <- Deleting an object. (e.g. DELETE /items/:id)
 *
 * Some actions types may not have a receiver, which is OK. The result of POST, PUT, and DELETE actions
 * may enter back into the system through subscriptions rather than in response to API requests.
 */

module.exports = keyMirror({

  // item actions
  ITEM_GETALL: null,
  ITEM_GETONE: null,
  ITEM_POST: null,
  ITEM_PUT: null,
  ITEM_DELETE: null,

  // servertime actions
  SERVERTIME_GET: null,
  SERVERTIME_PUT: null

});
