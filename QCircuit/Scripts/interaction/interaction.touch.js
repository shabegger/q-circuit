/// <reference path="interaction.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, UI, $, undefined) {

  'use strict';


  /* Private Functions */

  function namespaceEvent(eventName, namespace) {
    if (namespace) {
      return [eventName, '.', namespace].join('');
    }

    return eventName;
  }

  function touchifyHandler(handler) {
    return function (e) {
      var touches = e.touches,
          touch;

      if (touches && touches.length === 1) {
        touch = touches[0];
        e.offsetX = touch.clientX - self.offsetLeft;
        e.offsetY = touch.clientY - self.offsetTop;
      }

      handler.call(this, e);
    };
  }


  /* jQuery Plugins */

  $.fn.onInteractionDown = function onInteractionDown(handler, namespace) {
    var self = this;

    if (!$.isFunction(handler)) {
      return self;
    }

    if (window.navigator.msPointerEnabled) {
      return self.on(namespaceEvent('MSPointerDown', namespace), handler);
    } else {
      self.on(namespaceEvent('touchstart', namespace), touchifyHandler(handler));
      return self.on(namespaceEvent('mousedown', namespace), handler);
    }
  };

  $.fn.onInteractionMove = function onInteractionDown(handler, namespace) {
    var self = this;

    if (!$.isFunction(handler)) {
      return self;
    }

    if (window.navigator.msPointerEnabled) {
      return self.on(namespaceEvent('MSPointerMove', namespace), handler);
    } else {
      self.on(namespaceEvent('touchmove', namespace), touchifyHandler(handler));
      return self.on(namespaceEvent('mousemove', namespace), handler);
    }
  };

  $.fn.onInteractionUp = function onInteractionDown(handler, namespace) {
    var self = this;

    if (!$.isFunction(handler)) {
      return self;
    }

    if (window.navigator.msPointerEnabled) {
      return self.on(namespaceEvent('MSPointerUp', namespace), handler);
    } else {
      self.on(namespaceEvent('touchend', namespace), touchifyHandler(handler));
      return self.on(namespaceEvent('mouseup', namespace), handler);
    }
  };

  $.fn.onInteractionCancel = function onInteractionCancel(handler, namespace) {
    var self = this;

    if (!$.isFunction(handler)) {
      return self;
    }

    if (window.navigator.msPointerEnabled) {
      return self.on(namespaceEvent('MSPointerOut', namespace), handler);
    } else {
      self.on(namespaceEvent('touchleave', namespace), handler);
      self.on(namespaceEvent('touchcancel', namespace), handler);
      return self.on(namespaceEvent('mouseout', namespace), handler);
    }
  };

}(this, this.Interaction, this.jQuery));