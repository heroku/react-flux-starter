'use strict';

var React = require('react/addons');

var OverlayMixin = require('../../mixins/overlay');


module.exports = React.createClass({

  mixins: [OverlayMixin, React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      firstName: this.props.firstName || '',
      lastName: this.props.lastName || ''
    };
  },

  render: function () {
    var title = (this.props.firstName && this.props.lastName)
      ? "Update Item" : "Add New Item";

    return (
      <div className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
              <h4 className='modal-title'>{title}</h4>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="firstname">First Name</label>
                  <input ref="firstName" type="text" className="form-control" id="firstname" placeholder="First name" valueLink={this.linkState('firstName')} />
                </div>
                <div className="form-group">
                  <label htmlFor="lastname">Last Name</label>
                  <input type="text" className="form-control" id="lastname" placeholder="Last name" valueLink={this.linkState('lastName')} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={this._handleCancel}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={this._handleAdd}>OK</button>
            </div>
          </div>
        </div>
      </div>
    );
  },

  // uses Bootstrap modal's
  handleModalShown: function() {
    this.refs.firstName.getDOMNode().focus();
  },

  handleModalHidden: function() {
    if (this.confirmed) {
      if (this.props.okCallback) {
        this.props.okCallback(this.state.firstName, this.state.lastName);
      }
    }
    else {
      if (this.props.cancelCallback) {
        this.props.cancelCallback();
      }
    }
  },

  _handleAdd: function () {
    this.confirmed = true;
    this.hideModal();
  },

  _handleCancel: function () {
    this.hideModal();
  }

});
