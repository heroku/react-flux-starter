'use strict';

var React = require('react/addons');

var Router = require('react-router'),
    Route = Router.Route,
    NotFoundRoute = Router.NotFoundRoute,
    DefaultRoute = Router.Route;

module.exports = (

  <Route name="root" path="/" handler={require('./components/app.jsx')}>

    <DefaultRoute name="items" path="/" handler={require('./components/items.jsx')} />

    <Route name="server-time" handler={require('./components/server-time.jsx')} />

    <NotFoundRoute handler={require('./components/route-not-found.jsx')} />

  </Route>
);
