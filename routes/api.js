'use strict';

var _ = require('lodash');

var express = require('express');

var router = express.Router();


var _items = {
  'dd586160-cd1d-11e4-aaba-2566638c135c': {id: 'dd586160-cd1d-11e4-aaba-2566638c135c', first: 'John', last: 'Doe'},
  '42780a30-ce56-11e4-b45f-2d14dab59bc8': {id: '42780a30-ce56-11e4-b45f-2d14dab59bc8', first: 'Frank', last: 'Wells'},
  '80713690-ce56-11e4-b45f-2d14dab59bc8': {id: '80713690-ce56-11e4-b45f-2d14dab59bc8', first: 'Cindy', last: 'LooHoo'}
};

// response headers for all responses
router.use(function (req, res, next) {
  res.set('Cache-Control', 'public, max-age=0');
  next();
});


/**
 * items endpoint handlers
 */

router.route('/items')

  // GET list of items
  .get(function (req, res) {
    res.status(200).send(_.map(_items, function(item) { return item; }));
  })

  // POST new item
  .post(function (req, res) {
    var item = _.extend({}, req.body);
    _items[item.id] = item;

    // simulate slow response
    setTimeout(function () { res.status(200).send(item); }, 1000);

    // io.emit(req.user.id, 'POST /api/items/' + item.id, item);
  });



// validate id; lookup item in table
router.param('id', function (req, res, next, id) {
  var item = _items[id];
  if (item) {
    req.params.item = item;
    next();
  }
  else {
    return res.send(404, 'NOT FOUND');
  }
});

router.route('/items/:id')

  // GET item details
  .get(function(req, res) {
    res.send(req.params.item);
  })

  // PUT (update) details for the specified item
  .put(function (req, res) {

    var item = req.params.item;

    _.extend(item, req.body);

    _items[item.id] = item;   // this is necessary but just here for example

    // simulate slow response
    setTimeout(function () { res.status(200).send(item); }, 1000);

    // io.emit(req.user.id, 'PUT /api/items/' + id, item);
  })

  // DELETE the specified item
  .delete(function (req, res) {

    var id = req.params.item.id,
        resp = {id: id};

    delete _items[id];

    setTimeout(function () { res.status(200).send(resp); }, 1000);

    // io.emit(req.user.id, 'DELETE /api/items/' + id, {id: id});
  });


/**
 * Server-time endpoint handlers
 */
router.get('/api/servertime', function (req, res) {
  res.json(new Date().toString());
});

module.exports = router;
