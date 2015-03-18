'use strict';

var $ = require('jquery');

var Overlays = require('../actions/overlays');


module.exports = {

  componentDidMount: function() {
    var $node = $(this.getDOMNode());

    $node.on('shown.bs.modal', this._handleModalShown);
    $node.on('hidden.bs.modal', this._handleModalHidden);
    $(document).on('keyup', this._handleKeyUp);

    $node.modal({backdrop: 'static', keyboard: true});
  },

  componentWillUnmount: function() {
    var $node = $(this.getDOMNode());
    $node.off('hidden.bs.modal', this._handleModalHidden);
    $node.off('hidden.bs.modal', this._handleModalShown);
    $(document).off('keyup', this._handleKeyUp);
  },

  hideModal: function () {
    $(this.getDOMNode()).modal('hide');
  },

  _handleModalShown: function () {
    if (this.handleModalShown) {
      this.handleModalShown();
    }
  },

  _handleModalHidden: function() {
    if (this.handleModalHidden) {
      this.handleModalHidden();
    }
    Overlays.pop();
  },

  _handleKeyUp: function (e) {
    if (e.keyCode === 27) {
      this.hideModal();
    }
  }
};
