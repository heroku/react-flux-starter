'use strict';

var CRUDBase = require('./crud-base');

class ItemActions extends CRUDBase {

  // specify the baseURL and action object identifier for dispatches
  constructor() {
    super('/api/items', 'ITEM');
  }

  // define create json data appropriate for resource
  post (first, last) {
    var data = {
      first: first,
      last: last
    };
    super(data);
  }

  // define update json data appropriate for resource
  put (id, first, last) {
    var data = {
      id: id,
      first: first,
      last: last
    };
    super(id, data);
  }

}

module.exports = new ItemActions();
