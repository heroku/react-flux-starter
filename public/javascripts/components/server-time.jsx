'use strict';

var React = require('react/addons');

var Stores = require('../stores'),
    storeChangeMixin = require('../mixins/store-change');

var ServerTimeActions = require('../actions/server-time');

module.exports = React.createClass({

  mixins: [storeChangeMixin(Stores.ServerTimeStore)],

  getInitialState: function () {
    return {
      time: Stores.ServerTimeStore.getServerTime()
    };
  },

  storeChange: function () {
    this.setState({time: Stores.ServerTimeStore.getServerTime()});
  },

  componentDidMount: function() {
    ServerTimeActions.subscribe();
  },

  componentWillUnmount: function() {
    ServerTimeActions.unsubscribe();
  },

  render: function () {
    var content;

    if (!this.state.time) {
      content = <div>Unknown</div>;
    }
    else {
      content = <div>{this.state.time.data}</div>;
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12">
            <h3>Server Time</h3>
          </div>
          <div className="col-xs-12">
            {content}
          </div>
        </div>
      </div>
    );

  }
});
