'use strict';

var express = require('express');

var router = express.Router();

/**
 * Standard handler for returning index template
 * @function
 */
function indexRouteHandler (req, res) {
  res.render('index', {
    title: 'Example App',
    token: req['heroku-bouncer'] && req['heroku-bouncer'].token || '',
    herokuId: req['heroku-bouncer'] && req['heroku-bouncer'].id || ''
  });
}

router.get('/api/users/me', function (req, res) {
  res.json(req['heroku-bouncer']);
});

router.get('/api/items', function (req, res) {
  res.json([
    {id: 1, first: 'Howard', last: 'Burrows'},
    {id: 2, first: 'David', last: 'Gouldin'},
    {id: 3, first: 'Scott', last: 'Persinger'}
  ]);
});

router.get('/api/servertime', function (req, res) {
  res.json(new Date().toString());
});

/* GET home page. */
router.get('/*', indexRouteHandler);

module.exports = router;
