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

  function touchifyEvent(callback) {
    return function (e) {
      var event = e.originalEvent,
          touches = event.touches,
          touch;

      if ($.isNumeric(event.clientX)) {
        callback.call(this, {
          x: event.clientX,
          y: event.clientY
        });
      } else if (touches) {
        event.preventDefault();

        if (touches.length === 1) {
          touch = touches[0];

          callback.call(this, {
            x: touch.clientX,
            y: touch.clientY
          });
        }
      }
    };
  }


  /* jQuery Plugins */

  $.fn.onInteractionDown = function onInteractionDown(callback, namespace) {
    var self = this,
        handler;

    if (!$.isFunction(callback)) {
      return self;
    }

    handler = touchifyEvent(callback);

    if (window.navigator.pointerEnabled) {
      return self.on(namespaceEvent('pointerdown', namespace), handler)
    } else if (window.navigator.msPointerEnabled) {
      return self.on(namespaceEvent('MSPointerDown', namespace), handler);
    } else {
      self.on(namespaceEvent('touchstart', namespace), handler);
      return self.on(namespaceEvent('mousedown', namespace), handler);
    }
  };

  $.fn.offInteractionDown = function offInteractionDown(namespace) {
    var self = this;

    if (window.navigator.pointerEnabled) {
      return self.off(namespaceEvent('pointerdown', namespace))
    } else if (window.navigator.msPointerEnabled) {
      return self.off(namespaceEvent('MSPointerDown', namespace));
    } else {
      self.off(namespaceEvent('touchstart', namespace));
      return self.off(namespaceEvent('mousedown', namespace));
    }
  };

  $.fn.onInteractionMove = function onInteractionDown(callback, namespace) {
    var self = this,
        handler;

    if (!$.isFunction(callback)) {
      return self;
    }

    handler = touchifyEvent(callback);

    if (window.navigator.pointerEnabled) {
      return self.on(namespaceEvent('pointermove', namespace), handler)
    } else if (window.navigator.msPointerEnabled) {
      return self.on(namespaceEvent('MSPointerMove', namespace), handler);
    } else {
      self.on(namespaceEvent('touchmove', namespace), handler);
      return self.on(namespaceEvent('mousemove', namespace), handler);
    }
  };

  $.fn.offInteractionMove = function offInteractionDown(namespace) {
    var self = this;

    if (window.navigator.pointerEnabled) {
      return self.off(namespaceEvent('pointermove', namespace))
    } else if (window.navigator.msPointerEnabled) {
      return self.off(namespaceEvent('MSPointerMove', namespace));
    } else {
      self.off(namespaceEvent('touchmove', namespace));
      return self.off(namespaceEvent('mousemove', namespace));
    }
  };

  $.fn.onInteractionUp = function onInteractionDown(callback, namespace) {
    var self = this,
        handler;

    if (!$.isFunction(callback)) {
      return self;
    }

    handler = touchifyEvent(callback);

    if (window.navigator.pointerEnabled) {
      return self.on(namespaceEvent('pointerup', namespace), handler)
    } else if (window.navigator.msPointerEnabled) {
      return self.on(namespaceEvent('MSPointerUp', namespace), handler);
    } else {
      self.on(namespaceEvent('touchend', namespace), handler);
      return self.on(namespaceEvent('mouseup', namespace), handler);
    }
  };

  $.fn.offInteractionUp = function offInteractionDown(namespace) {
    var self = this;

    if (window.navigator.pointerEnabled) {
      return self.off(namespaceEvent('pointerup', namespace))
    } else if (window.navigator.msPointerEnabled) {
      return self.off(namespaceEvent('MSPointerUp', namespace));
    } else {
      self.off(namespaceEvent('touchend', namespace));
      return self.off(namespaceEvent('mouseup', namespace));
    }
  };

  $.fn.onInteractionCancel = function onInteractionCancel(callback, namespace) {
    var self = this,
        handler;

    if (!$.isFunction(callback)) {
      return self;
    }

    handler = touchifyEvent(callback);

    if (window.navigator.pointerEnabled) {
      return self.on(namespaceEvent('pointerout', namespace), handler)
    } else if (window.navigator.msPointerEnabled) {
      return self.on(namespaceEvent('MSPointerOut', namespace), handler);
    } else {
      self.on(namespaceEvent('touchleave', namespace), handler);
      self.on(namespaceEvent('touchcancel', namespace), handler);
      return self.on(namespaceEvent('mouseout', namespace), handler);
    }
  };

  $.fn.offInteractionCancel = function offInteractionCancel(namespace) {
    var self = this;

    if (window.navigator.pointerEnabled) {
      return self.off(namespaceEvent('pointerout', namespace))
    } else if (window.navigator.msPointerEnabled) {
      return self.off(namespaceEvent('MSPointerOut', namespace));
    } else {
      self.off(namespaceEvent('touchleave', namespace));
      self.off(namespaceEvent('touchcancel', namespace));
      return self.off(namespaceEvent('mouseout', namespace));
    }
  };

}(this, this.Interaction, this.jQuery));