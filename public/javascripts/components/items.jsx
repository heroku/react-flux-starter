'use strict';

var _ = require('lodash');

var React = require('react/addons');

var Stores = require('../stores'),
    storeChangeMixin = require('../mixins/store-change');

var kStates = require('../constants/states');

var ItemActions = require('../actions/items');

var Overlays = require('../actions/overlays');

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
            <tr><th>First Name</th><th>Last Name</th><th>Id</th></tr>
           </thead>
           <tbody>
             {_.map(this.state.items, item =>
               <tr key={item.data.id} style={_.contains([kStates.NEW, kStates.SAVING, kStates.DELETING], item.state) ? {color:'#ccc'} : {}}>
                 <td>{item.data.first}</td><td>{item.data.last}</td><td>{item.data.id}</td>
               </tr>
             )}
          </tbody>
        </table>
      );
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12">
            <header>
              <h3 style={{display:'inline-block',marginTop:'0'}}>Items</h3>
              <button type="button" className="btn btn-default pull-right" onClick={this._onAdd}>
                <span className="glyphicon glyphicon-plus"></span>
              </button>
            </header>
          </div>
          <div className="col-xs-12">
            {content}
          </div>
        </div>
      </div>
    );
  },

  _onAdd: function () {
    var overlay = React.createFactory(require('./overlays/item-form.jsx'));
    return Overlays.push(overlay({
      okCallback: (firstName, lastName) => ItemActions.post(firstName, lastName)
    }, null));
  }

});
