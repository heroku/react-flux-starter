'use strict';

var _ = require('lodash');

var React = require('react/addons');

var Stores = require('../stores'),
    storeChangeMixin = require('../mixins/store-change');

module.exports = React.createClass({

  mixins: [storeChangeMixin(Stores.ItemsStore)],

  getInitialState: function () {
    return {
      items: Stores.ItemsStore.getAll()
    };
  },

  storeChange: function () {
    this.setState({items: Stores.ItemsStore.getAll()});
  },

  render: function () {
    var content;

    if (!this.state.items) {
      content = <div>Loading...</div>;
    }
    else {
      content = (
        <table className="table">
          <thead>
            <tr><th>Id</th><th>First</th><th>Last</th></tr>
           </thead>
           <tbody>
             {_.map(this.state.items, item => <tr key={item.id}><td>{item.id}</td><td>{item.first}</td><td>{item.last}</td></tr>)}
          </tbody>
        </table>
      );
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12">
            <h3>Items</h3>
          </div>
          <div className="col-xs-12">
            {content}
          </div>
        </div>
      </div>
    );
  }
});
