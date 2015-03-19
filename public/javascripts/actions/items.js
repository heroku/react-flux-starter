'use strict';

var CRUDBase = require('./crud-base');

/**
 * Basic CRUD actions for a RESTful JSON "resource".  Overriding "post" and "put"
 * to create JSON payload that the endpoint expects.
 */

class ItemActions extends CRUDBase {

  // specify the baseURL and action object identifier for dispatches
  constructor() {
    super('/api/items', 'ITEM');
  }

  // define "create" json payload appropriate for resource
  post (first, last) {
    var data = {
      first: first,
      last: last
    };
    return super.post(data);
  }

  // define "update" json payload appropriate for resource
  put (id, first, last) {
    var data = {
      id: id,
      first: first,
      last: last
    };
    super.put(id, data);
  }

}

module.exports = new ItemActions();
