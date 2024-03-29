﻿/// <reference path="interaction.js" />
/// <reference path="interaction.context.js" />
/// <reference path="interaction.touch.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, UI, $, undefined) {

  'use strict';


  /* Private Variables */

  var _namespace = 'interaction-drag',
      _body = $('body'),
      _currentDraggable = null,
      _options = null,
      _dragHandler = null,
      _moveHandler = null,
      _dropHandler = null,
      _cancelHandler = null,
      _dragData = null;


  /* Event Handlers */

  function onDown(e) {
    var offset, top, left, transform;

    if (_currentDraggable) {
      return;
    }

    _currentDraggable = $(this);
    _options = _currentDraggable.dragOptions();

    _dragHandler = $.isFunction(_options.drag) ? _options.drag : null;
    _moveHandler = $.isFunction(_options.move) ? _options.move : null;
    _dropHandler = $.isFunction(_options.drop) ? _options.drop : null;
    _cancelHandler = $.isFunction(_options.cancel) ? _options.cancel : null;

    offset = _currentDraggable.offset();
    top = offset.top;
    left = offset.left;
    transform = ['translate(', left, 'px, ', top, 'px)'].join('');

    _dragData = {
      deltaX: left - e.x,
      deltaY: top - e.y,
      position: _currentDraggable.css('position'),
      top: _currentDraggable.css('top'),
      left: _currentDraggable.css('left'),
      parent: _currentDraggable.parent(),
      constrainX: _options.constrain === 'x',
      constrainY: _options.constrain === 'y'
    };

    _currentDraggable
      .touchContext(false)
      .offInteractionDown(_namespace)
      .remove()
      .css({
        '-ms-transform': transform,
        '-webkit-transform': transform,
        'transform': transform,
        'position': 'absolute',
        'top': 0,
        'left': 0
      });

    _body
      .onInteractionMove(onMove, _namespace)
      .onInteractionUp(onUp, _namespace)
      .onInteractionCancel(onCancel, _namespace)
      .append(_currentDraggable);

    _dragHandler && _dragHandler.call(_currentDraggable, {
      top: top,
      left: left
    });
  }

  function onMove(e) {
    var top = e.y + _dragData.deltaY,
        left = e.x + _dragData.deltaX,
        transform = ['translate(', left, 'px, ', top, 'px)'].join('');

    _currentDraggable
      .css({
        '-ms-transform': transform,
        '-webkit-transform': transform,
        'transform': transform
      });

    _moveHandler && _moveHandler.call(_currentDraggable, {
      top: top,
      left: left
    });
  }

  function onUp(e) {
    var offset = _currentDraggable.offset(),
        delay = _options.contextDelay;

    _currentDraggable
      .css({
        '-ms-transform': 'none',
        '-webkit-transform': 'none',
        'transform': 'none',
        'top': offset.top,
        'left': offset.left
      });

    _body
      .offInteractionMove(_namespace)
      .offInteractionUp(_namespace)
      .offInteractionCancel(_namespace);

    _dropHandler && _dropHandler.call(_currentDraggable);

    _currentDraggable
      .touchContext(delay !== undefined && delay)
      .onInteractionDown(onDown, _namespace);

    _currentDraggable = null;
    _dragData = null;

    _options = null;
    _dragHandler = null;
    _moveHandler = null;
    _dropHandler = null;
    _cancelHandler = null;
  }

  function onCancel(e) {
    var relatedTarget = e.originalEvent.relatedTarget,
        isDefaultPrevented = false,
        delay = _options.contextDelay,
        offset,
        event;

    if (relatedTarget && relatedTarget.tagName !== 'HTML') {
      return;
    }

    offset = _currentDraggable.offset();

    _currentDraggable
      .css({
        '-ms-transform': 'none',
        '-webkit-transform': 'none',
        'transform': 'none',
        'top': offset.top,
        'left': offset.left
      });

    _body
      .offInteractionMove(_namespace)
      .offInteractionUp(_namespace)
      .offInteractionCancel(_namespace);

    event = {
      preventDefault: function preventDefault() {
        isDefaultPrevented = true;
      }
    };

    _cancelHandler && _cancelHandler.call(_currentDraggable, event);

    if (isDefaultPrevented) {
      _currentDraggable
        .touchContext(delay !== undefined && delay)
        .onInteractionDown(onDown, _namespace);
    } else {
      _currentDraggable
        .remove()
        .css({
          'position': _dragData.position,
          'top': _dragData.top,
          'left': _dragData.left
        })
        .appendTo(_dragData.parent)
        .touchContext(delay !== undefined && delay)
        .onInteractionDown(onDown, _namespace);
    }

    _currentDraggable = null;
    _dragData = null;

    _options = null;
    _dragHandler = null;
    _moveHandler = null;
    _dropHandler = null;
    _cancelHandler = null;
  }


  /* jQuery Plugins */

  $.fn.dragOptions = function dragOptions(options) {
    var self = this;

    if (!options) {
      return self.get(0)._dragOptions;
    }

    return self.each(function (i, element) {
      element._dragOptions = options;
    });
  };

  //  options - if false, remove drag
  //    drag: callback function called when drag starts
  //    move: callback function called when moved
  //    drop: callback function called when dropped
  //    cancel: callback function called when drag cancelled
  //    contextDelay: delay before firing context callback
  //    constrain: "x" or "y" to allow drag only horizontally or vertically
  $.fn.draggable = function draggable(options) {
    var self = this,
        delay = options.contextDelay;

    if (options === false) {
      return self
        .touchContext(false)
        .offInteractionDown(_namespace);
    } else {
      return self
        .dragOptions(options || {})
        .touchContext(delay !== undefined && delay)
        .onInteractionDown(onDown, _namespace);
    }
  };

}(this, this.Interaction, this.jQuery));
