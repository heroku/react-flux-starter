'use strict';

var $ = require('jquery');

var Overlays = require('../actions/overlays');


module.exports = {

  componentDidMount: function() {
    var $node = $(this.getDOMNode());

    $node.on('hidden.bs.modal', this._handleModalHide);
    $(document).on('keyup', this._handleKeyUp);

    $node.modal({backdrop: 'static', keyboard: true});
  },

  componentWillUnmount: function() {
    $(this.getDOMNode()).off('hidden.bs.modal', this._handleModalHide);
    $(document).off('keyup', this._handleKeyUp);
  },

  hideModal: function () {
    $(this.getDOMNode()).modal('hide');
  },

  _handleModalHide: function() {
    if (this.handleModalHide) {
      this.handleModalHide();
    }
    Overlays.pop();
  },

  _handleKeyUp: function (e) {
    if (e.keyCode === 27) {
      this.hideModal();
    }
  }
};
