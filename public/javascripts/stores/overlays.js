'use strict';

var _ = require('lodash');

var kActions = require('../constants/actions');

var BaseStore = require('./base');

var _handlers = _.zipObject([
  [kActions.OVERLAY_PUSH, '_onOverlayPush'],
  [kActions.OVERLAY_POP, '_onOverlayPop']
]);


class OverlaysStore extends BaseStore {

  initialize() {
    this._overlays = [];
  }

  _getActions(){
    return _handlers;
  }

  getTopOverlay() {
    return this._overlays.length ? this._overlays[this._overlays.length - 1] : null;
  }

  // action handlers
  _onOverlayPush(payload) {
    this._overlays.push(payload.data.component);
    this.emitChange();
  }

  _onOverlayPop() {
    this._overlays.pop();
    this.emitChange();
  }

}

module.exports = OverlaysStore;
