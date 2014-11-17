/// <reference path="interaction.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, $, undefined) {

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
        callback.call(this, $.extend(e, {
          x: event.clientX,
          y: event.clientY
        }));
      } else if (touches) {
        event.preventDefault();

        if (touches.length > 0) {
          touch = touches[0];

          callback.call(this, $.extend(e, {
            x: touch.clientX,
            y: touch.clientY
          }));
        } else {
          callback.call(this, e);
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
      return self.on(namespaceEvent('touchstart', namespace), handler)
        .on(namespaceEvent('mousedown', namespace), handler);
    }
  };

  $.fn.offInteractionDown = function offInteractionDown(namespace) {
    var self = this;

    if (window.navigator.pointerEnabled) {
      return self.off(namespaceEvent('pointerdown', namespace))
    } else if (window.navigator.msPointerEnabled) {
      return self.off(namespaceEvent('MSPointerDown', namespace));
    } else {
      return self.off(namespaceEvent('touchstart', namespace))
        .off(namespaceEvent('mousedown', namespace));
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
      return self.on(namespaceEvent('touchmove', namespace), handler)
        .on(namespaceEvent('mousemove', namespace), handler);
    }
  };

  $.fn.offInteractionMove = function offInteractionDown(namespace) {
    var self = this;

    if (window.navigator.pointerEnabled) {
      return self.off(namespaceEvent('pointermove', namespace))
    } else if (window.navigator.msPointerEnabled) {
      return self.off(namespaceEvent('MSPointerMove', namespace));
    } else {
      return self.off(namespaceEvent('touchmove', namespace))
        .off(namespaceEvent('mousemove', namespace));
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
      return self.on(namespaceEvent('touchend', namespace), handler)
        .on(namespaceEvent('mouseup', namespace), handler);
    }
  };

  $.fn.offInteractionUp = function offInteractionDown(namespace) {
    var self = this;

    if (window.navigator.pointerEnabled) {
      return self.off(namespaceEvent('pointerup', namespace))
    } else if (window.navigator.msPointerEnabled) {
      return self.off(namespaceEvent('MSPointerUp', namespace));
    } else {
      return self.off(namespaceEvent('touchend', namespace))
        .off(namespaceEvent('mouseup', namespace));
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
      return self.on(namespaceEvent('touchleave', namespace), handler)
        .on(namespaceEvent('touchcancel', namespace), handler)
        .on(namespaceEvent('mouseout', namespace), handler);
    }
  };

  $.fn.offInteractionCancel = function offInteractionCancel(namespace) {
    var self = this;

    if (window.navigator.pointerEnabled) {
      return self.off(namespaceEvent('pointerout', namespace))
    } else if (window.navigator.msPointerEnabled) {
      return self.off(namespaceEvent('MSPointerOut', namespace));
    } else {
      return self.off(namespaceEvent('touchleave', namespace))
        .off(namespaceEvent('touchcancel', namespace))
        .off(namespaceEvent('mouseout', namespace));
    }
  };

}(this, this.jQuery));
