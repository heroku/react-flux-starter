'use strict';

var _ = require('lodash');

var express = require('express');

var router = express.Router();

var _id = 3;

var _items = [
  {id: 1, first: 'Howard', last: 'Burrows'},
  {id: 2, first: 'David', last: 'Gouldin'},
  {id: 3, first: 'Scott', last: 'Persinger'}
];

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
    res.status(200).send(_items);
  })

  // POST new item
  .post(function (req, res) {
    var item = _.extend({}, req.body);
    item.id = _id += 1;
    _items[item.id] = item;
    res.status(200).send(item);

    // io.emit(req.user.id, 'POST /api/items/' + item.id, item);
  });



// validate id; lookup item in table
router.param('id', function (req, res, next, id) {
  var item = _items[parseInt(id, 10)];
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

    res.status(200).send(item);

    //io.emit(req.user.id, 'PUT /api/items/' + id, item);
  })

  // DELETE the specified item
  .delete(function (req, res) {

    var id = req.params.item.id,
        resp = {id: id};

    delete _items[id];

    res.status(200).send(resp);

//    io.emit(req.user.id, 'DELETE /api/items/' + id, {id: id});

  });


/**
 * Server-time endpoint handlers
 */
router.get('/api/servertime', function (req, res) {
  res.json(new Date().toString());
});

module.exports = router;
