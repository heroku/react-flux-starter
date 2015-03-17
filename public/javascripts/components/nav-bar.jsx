'use strict';

var React = require('react/addons');

var Router = require('react-router'),
    Link = Router.Link;

module.exports = React.createClass({
  mixins: [Router.State],
  render: function () {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link to="root" className="navbar-brand" >{window.EX.const.title}</Link>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className={this.isActive('items') ? "active" : ''}><Link to="items">Items</Link></li>
              <li className={this.isActive('server-time') ? "active" : ''}><Link to="server-time">Server-Time</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});
