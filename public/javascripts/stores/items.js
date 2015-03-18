'use strict';

var _ = require('lodash');

var CRUDBase = require('./crud-base');

var ItemActions = require('../actions/items');

/**
 * Basic CRUD store for a RESTful JSON "resource".  Overriding "getAll" to add
 * sort order to resources lists.
 */
class ItemsStore extends CRUDBase {

  // specify the action instance and action object identifier (and dispatcher)
  constructor(dispatcher) {
    super(dispatcher, ItemActions, 'ITEM');
  }

  getAll() {
    return _.sortBy(super.getAll(), item => item.data.last + item.data.first);
  }

}

module.exports = ItemsStore;
