'use strict';

var _ = require('lodash');

var React = require('react/addons');

var OverlayMixin = require('../../mixins/overlay');


module.exports = React.createClass({

  mixins: [OverlayMixin],

  render: function () {
    var content;

    if (_.isString(this.props.msg)) {
      // simple string message
      content = (
        <p>{this.props.msg}</p>
      );
    }
    else {
      // message is an element
      content = this.props.msg;
    }

    return (
      <div className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
              <h4 className="modal-title">{this.props.title || 'Confirm'}</h4>
            </div>
            <div className="modal-body">
              {content}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={this._handleNo}>No</button>
              <button type="button" className="btn btn-primary" onClick={this._handleYes}>Yes</button>
            </div>
          </div>
        </div>
      </div>
    );
  },

  handleModalHidden: function() {
    if (this.confirmed) {
      if (this.props.yesCallback) {
        this.props.yesCallback();
      }
    }
    else {
      if (this.props.noCallback) {
        this.props.noCallback();
      }
    }
  },

  _handleYes: function () {
    this.confirmed = true;
    this.hideModal();
  },

  _handleNo: function () {
    this.hideModal();
  }

});
