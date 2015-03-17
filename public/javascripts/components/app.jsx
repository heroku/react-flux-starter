'use strict';

var React = require('react/addons');

var Router = require('react-router'),
    RouteHandler = Router.RouteHandler;

var NavBar = require('./nav-bar.jsx');

module.exports = React.createClass({

  mixins: [Router.State],

  getInitialState: function () {
    return {};
  },

  render: function () {
    return (
      <div>
        <NavBar />
        <RouteHandler />
      </div>
    );
  }
});
