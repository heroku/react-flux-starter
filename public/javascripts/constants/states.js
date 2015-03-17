'use strict';

var keyMirror = require('react/lib/keyMirror');

/**
  * Store entities need the concept of "new", "dirty", "deleted" (i.e. isNew, isDirty, isDelete) which
  * when combined with state (synced, request, errored) provides components good detail on how to
  * render
  *
  */

module.exports = keyMirror({

  /* entity states */
  SYNCED: null,     // entity is in sync with backend
  LOADING: null,    // entity is in-process of being fetched from backend (implies GET)
  NEW: null,        // entity is new and in-process of syncing with backend
  SAVING: null,     // entity is dirty and in-process of syncing with backend
  DELETING: null,   // entity has been deleted and in-process of syncing with backend
  ERRORED: null     // entity is in an error state and potentially out-of-sync with server

});
