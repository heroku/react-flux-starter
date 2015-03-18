'use strict';

var _ = require('lodash');

var express = require('express');

var router = express.Router();


var _items = {
  'dd586160-cd1d-11e4-aaba-2566638c135c': {id: 'dd586160-cd1d-11e4-aaba-2566638c135c', first: 'Howard', last: 'Burrows'},
  'e7b03cf0-cd1d-11e4-aaba-2566638c135c': {id: 'e7b03cf0-cd1d-11e4-aaba-2566638c135c', first: 'David', last: 'Gouldin'},
  '07046900-cd1e-11e4-aaba-2566638c135c': {id: '07046900-cd1e-11e4-aaba-2566638c135c', first: 'Scott', last: 'Persinger'}
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
    setTimeout(function () { res.status(200).send(item); }, 2000);

    console.log(_items);
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
