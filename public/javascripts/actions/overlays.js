/** @module actions/status */

'use strict';

var React = require('react/addons');

var Actions = require('./base');

var kActions = require('../constants/actions'),
    kStates = require('../constants/states');

/**
 * Overlays are basic modals or popups.  Various alerts and confirms are predefined.
 */

class OverlaysActions extends Actions {

  /**
   * push new overlay component onto Overlay stack
   * @method push
   */
  push(component) {
    //console.debug('OverlaysActions.push');
    var that = this;
    return new Promise(function (resolve) {
      process.nextTick(function () {
        that.dispatchViewAction(kActions.OVERLAY_PUSH, kStates.SYNCED, {component: component});
        resolve();
      });
    });
  }

  /**
   * pop top overlay from Overlay stack
   * @method pop
   */
  pop() {
    //console.debug('OverlaysActions.pop');
    this.dispatchViewAction(kActions.OVERLAY_POP, kStates.SYNCED, null);
  }

  /**
   * display a simple 'alert' modal
   * @method alert
   */
  alert(title, msg, ackCallback) {
    var alertOverlay = React.createFactory(require('../components/overlays/alert.jsx'));
    return this.push(alertOverlay({
      title: title,
      msg: msg,
      ackCallback: ackCallback
    }, null));
  }

  /**
   * display a simple modal with an informational message
   * @method info
   */
  info(msg, title) {
    return this.alert(title || 'Info', msg);
  }

  /**
   * display a simple modal with an error message
   * @method error
   */
  error(msg, title) {
    return this.alert(title || 'Error', msg);
  }

  /**
   * display a simple modal with a warning message
   * @method warn
   */
  warn(msg, title) {
    return this.alert(title || 'Warning', msg);
  }


  /**
   * display a simple 'confirm' modal with yes/no responses
   * @method confirm
   */
  confirm(title, msg, yesCallback, noCallback) {
    var confirmOverlay = React.createFactory(require('../components/overlays/confirm.jsx'));
    return this.push(confirmOverlay({
      title: title,
      msg: msg,
      yesCallback: yesCallback,
      noCallback: noCallback
    }, null));
  }

}

module.exports = new OverlaysActions();
