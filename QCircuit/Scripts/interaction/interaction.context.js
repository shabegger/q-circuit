﻿/// <reference path="interaction.js" />
/// <reference path="interaction.touch.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, UI, $, undefined) {

  'use strict';


  /* Private Variables */

  var _namespace = 'interaction-context',
      _body = $('body'),
      _isPassingEvent = false,
      _current = null,
      _originalEvent = null,
      _contextTimeout = null;


  /* Event Handlers */

  function onDown(e) {
    var delay;

    if (_isPassingEvent) {
      return;
    }

    _current = $(this);
    _originalEvent = e.originalEvent;
    
    delay = _current.touchDelay();

    _body
      .onInteractionUp(onCancel, _namespace)
      .onInteractionCancel(onCancel, _namespace)
      .onInteractionMove(onMove, _namespace);

    _contextTimeout && window.clearTimeout(_contextTimeout);
    _contextTimeout = window.setTimeout(contextHandler, delay);

    e.preventDefault();
    e.stopImmediatePropagation();
  }

  function contextHandler() {
    _current.trigger('contextmenu');
    onCancel();
  }

  function onMove(e) {
    var event = $.Event(_originalEvent.type);
    event.originalEvent = _originalEvent;

    _isPassingEvent = true;
    _current.trigger(event);
    _isPassingEvent = false;

    onCancel();
  }

  function onCancel() {
    _body
      .offInteractionMove(_namespace)
      .offInteractionUp(_namespace)
      .offInteractionCancel(_namespace);

    _contextTimeout && window.clearTimeout(_contextTimeout);

    _current = null;
    _originalEvent = null;
    _contextTimeout = null;
  }


  /* jQuery Plugins */

  $.fn.touchDelay = function touchDelay(delay) {
    var self = this;

    if (!delay) {
      return self.get(0)._touchDelay;
    }

    return self.each(function (i, element) {
      element._touchDelay = delay;
    });
  };

  //  delay: delay before firing context callback (default 1000ms)
  $.fn.touchContext = function touchContext(delay) {
    var self = this;

    if (delay === false) {
      return self
        .offInteractionDown(_namespace);
    } else {
      return self
        .touchDelay((delay !== true && delay) || 1000)
        .onInteractionDown(onDown, _namespace);
    }
  };

}(this, this.Interaction, this.jQuery));
