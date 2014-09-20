/// <reference path="mixins.js" />

; (function (window, Mixins, undefined) {

  'use strict';


  /* Event-Enabled Object Functions */

  function addEventListener(event, callback) {
    var events = this._events,
        callbacks = events[event] = events[event] || [];

    callbacks.push(callback);
  }

  function removeEventListener(event, callback) {
    var events = this._events,
        callbacks = events[event],
        i, len;

    if (callbacks) {
      if (callback) {
        for (i = 0, len = callbacks.length; i < len; i++) {
          if (callbacks[i] === callback) {
            callbacks.splice(i, 1);
            i--;
          }
        }
      } else {
        events[event] = null;
      }
    }
  }

  function dispatchEvent(event, eventArgs) {
    var events = this._events,
        callbacks = events[event],
        i, len;

    eventArgs = eventArgs || {};
    eventArgs.sender = this;

    if (callbacks) {
      for (i = 0, len = callbacks.length; i < len; i++) {
        callbacks[i].call(this, eventArgs);
      }
    }
  }


  /* Mixin Functions */

  function mixinEvents(object) {
    Mixins.extend(object, {
      _events: {},
      addEventListener: addEventListener,
      removeEventListener: removeEventListener,
      dispatchEvent: dispatchEvent
    });
  }


  /* Expose */

  Mixins.Events = {
    mixinEvents: mixinEvents
  };

}(this, this.Mixins));
