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
              <h4 className="modal-title">{this.props.title || 'Alert'}</h4>
            </div>
            <div className="modal-body">
              {content}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={this.handleOK}>OK</button>
            </div>
          </div>
        </div>
      </div>
    );
  },


  handleModalHide: function() {
    if (this.props.ackCallback) {
      this.props.ackCallback();
    }
  },

  handleOK: function () {
    this.hideModal();
  }

});
