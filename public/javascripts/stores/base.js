'use strict';

var EventEmitter = require('events').EventEmitter;

var _ = require('lodash');
var Immutable = require('immutable');

const CHANGE_EVENT = 'change';

class BaseStore extends EventEmitter {
  constructor(dispatcher) {
    super();
    this.dispatcher = dispatcher;
    this.inFlight = false;
    this.error = null;
    this._register();
    this.initialize();
  }

  initialize() {}

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  getState() {
    return undefined;
  }

  isInFlight() {
    return this.inFlight;
  }

  getActions(){
    return {};
  }

  getStoreName() {
    return this.constructor.name;
  }

  // for creating a standard store entry that captures the entities state
  makeStatefulEntry(state=undefined, data=undefined) {
    return {
      meta: {
        state: state
      },
      data: data
    };
  }

  updateStatefulEntry(entry, state, data) {
    _.extend(entry.data || (entry.data = {}), data);
    entry.meta.state = state;
    return entry;
  }

  _register() {
    this.dispatchToken = this.dispatcher.register(_.bind(function (payload) {
      this._handleAction(payload.action.actionType, payload.action);
    }, this));
  }

  _handleAction(actionType, action){
    // Proxy actionType to the instance method defined in actions[actionType],
    // or optionally if the value is a function, invoke it instead.
    var actions = this.getActions();
    if (actions.hasOwnProperty(actionType)) {
      var actionValue = actions[actionType];
      if (_.isString(actionValue)) {
        if (_.isFunction(this[actionValue])) {
          this[actionValue](action);
        }
        else {
          throw new Error(`Action handler defined in Store map is undefined or not a Function. Store: ${this.constructor.name}, Action: ${actionType}`);
        }
      }
      else if (_.isFunction(actionValue)) {
        actionValue.call(this, action);
      }
    }
  }

  _makeStoreEntry() {
    return Immutable.fromJS({
      _meta: {
        state: undefined
      }
    });
  }

}

module.exports = BaseStore;
