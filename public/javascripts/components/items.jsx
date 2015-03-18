'use strict';

var _ = require('lodash');

var React = require('react/addons');

var Stores = require('../stores'),
    storeChangeMixin = require('../mixins/store-change');

var kStates = require('../constants/states');

var ItemActions = require('../actions/items');

var Overlays = require('../actions/overlays');

/**
 * Simple example of a basic CRUD interface.  List items and supports
 * create, edit, delete of items in list.
 *
 * Uses the CRUD based Item Store and Actions.  Listens to changes to the
 * Item store.  Uses Reacts PureRenderMixin to only render when state or
 * props have changed (would work even better if using Immutable JS)
 */

module.exports = React.createClass({

  mixins: [storeChangeMixin(Stores.ItemsStore), React.addons.PureRenderMixin],

  getInitialState: function () {
    return {
      items: Stores.ItemsStore.getAll(),
      selection: null
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
               <tr key={item.data.id}
                   className={this.state.selection === item.data.id ? 'active' : ''}
                   style={{
                     color: _.contains([kStates.NEW, kStates.SAVING, kStates.DELETING], item.state) ? '#ccc' : 'inherit',
                     textDecoration: item.state === kStates.DELETING ? 'line-through' : 'none'}}
                   onClick={this._onClick.bind(this, item.data.id)} >
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
              <button type="button" className="btn btn-default pull-right" disabled={!this.state.selection} onClick={this._onDelete}>
                <span className="glyphicon glyphicon-trash"></span>
              </button>
              <button type="button" className="btn btn-default pull-right" disabled={!this.state.selection} onClick={this._onUpdate}>
                <span className="glyphicon glyphicon-pencil"></span>
              </button>
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

  _onClick: function (id) {
    this.setState({selection: id});
  },

  _onAdd: function () {
    var overlay = React.createFactory(require('./overlays/item-form.jsx'));
    return Overlays.push(overlay({
      okCallback: (firstName, lastName) => ItemActions.post(firstName, lastName)
    }, null));
  },

  _onUpdate: function () {
    var item = Stores.ItemsStore.get(this.state.selection);
    var overlay = React.createFactory(require('./overlays/item-form.jsx'));
    return Overlays.push(overlay({
      firstName: item.data.first,
      lastName: item.data.last,
      okCallback: (firstName, lastName) => ItemActions.put(this.state.selection, firstName, lastName)
    }, null));
  },

  _onDelete: function () {
    ItemActions.delete(this.state.selection);
    this.setState({selection: null});
  }

});
