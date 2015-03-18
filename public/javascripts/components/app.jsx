'use strict';

// bootstrap initialization
var $ = require('jquery');
window.jQuery = $;
require('bootstrap');

var React = require('react/addons');

var Router = require('react-router'),
    RouteHandler = Router.RouteHandler;

var NavBar = require('./nav-bar.jsx'),
    OverlayManager = require('./overlays/overlay-manager.jsx');

module.exports = React.createClass({

  mixins: [Router.State],

  render: function () {
    return (
      <div>
        <NavBar />
        <RouteHandler />
        <OverlayManager />
      </div>
    );
  }
});
