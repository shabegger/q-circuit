/// <reference path="interaction.js" />
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
      _contextDelay = null,
      _contextTimeout = null,
      _dragData = null;


  /* Event Handlers */

  function onDown(e) {
    var offset, top, left, transform;

    if (_currentDraggable) {
      return;
    }

    _currentDraggable = $(this);
    _options = _currentDraggable.dragOptions();

    if (_options.contextDelay === undefined) {
      _contextDelay = null;
    } else {
      _contextDelay = _options.contextDelay === true ?
        1000 : _options.contextDelay;
    }

    _dragHandler = $.isFunction(_options.drag) ? _options.drag : null;
    _moveHandler = $.isFunction(_options.move) ? _options.move : null;
    _dropHandler = $.isFunction(_options.drop) ? _options.drop : null;
    _cancelHandler = $.isFunction(_options.cancel) ? _options.cancel : null;

    offset = _currentDraggable.offset();
    top = offset.top;
    left = offset.left;

    _dragData = {
      deltaX: left - e.x,
      deltaY: top - e.y,
      oTop: top,
      oLeft: left,
      position: _currentDraggable.css('position'),
      top: _currentDraggable.css('top'),
      left: _currentDraggable.css('left'),
      parent: _currentDraggable.parent(),
      constrainX: _options.constrain === 'x',
      constrainY: _options.constrain === 'y'
    };

    _currentDraggable.offInteractionDown(_namespace);

    if (_contextDelay) {
      _body
        .onInteractionUp(beforeFirstMove, _namespace)
        .onInteractionCancel(beforeFirstMove, _namespace)
        .onInteractionMove(firstMove, _namespace);

      _contextTimeout = window.setTimeout(contextHandler, _contextDelay);
    } else {
      firstMove.call(this);
    }
  }

  function contextHandler() {
    var event = $.Event('contextmenu');

    event.clientX = _dragData.oLeft - _dragData.deltaX;
    event.clientY = _dragData.oTop - _dragData.deltaY;

    _currentDraggable.trigger(event);
    beforeFirstMove.call(this);
  }

  function beforeFirstMove(e) {
    _contextTimeout && window.clearTimeout(_contextTimeout);
    _contextTimeout = null;

    _body
      .offInteractionMove(_namespace)
      .offInteractionUp(_namespace)
      .offInteractionCancel(_namespace);

    _currentDraggable
      .onInteractionDown(onDown, _namespace);

    _currentDraggable = null;
    _dragData = null;

    _options = null;
    _contextDelay = null;
    _dragHandler = null;
    _moveHandler = null;
    _dropHandler = null;
    _cancelHandler = null;
  }

  function firstMove(e) {
    var transform,
        top, left;

    if (e) {
      // IE calls this after a given period of time, even if no move occurred
      top = e.y + _dragData.deltaY;
      left = e.x + _dragData.deltaX;

      if (_dragData.oLeft === left && _dragData.oTop === top) {
        return;
      }
    }

    _contextTimeout && window.clearTimeout(_contextTimeout);
    _contextTimeout = null;

    _currentDraggable
      .remove()
      .css({
        'position': 'absolute',
        'top': 0,
        'left': 0
      });

    _body
      .offInteractionMove(_namespace)
      .offInteractionUp(_namespace)
      .offInteractionCancel(_namespace)
      .onInteractionMove(onMove, _namespace)
      .onInteractionUp(onUp, _namespace)
      .onInteractionCancel(onCancel, _namespace)
      .append(_currentDraggable);

    _dragHandler && _dragHandler.call(_currentDraggable, {
      top: _dragData.oTop,
      left: _dragData.oLeft
    });

    if (e) {
      onMove.call(this, e);
    } else {
      transform = [
        'translate(',
        _dragData.oLeft, 'px, ',
        _dragData.oTop, 'px)'
      ].join('');

      _currentDraggable
        .css({
          '-ms-transform': transform,
          '-webkit-transform': transform,
          'transform': transform
        });
    }
  }

  function onMove(e) {
    var top = _dragData.constrainX ? _dragData.oTop : e.y + _dragData.deltaY,
        left = _dragData.constrainY ? _dragData.oLeft : e.x + _dragData.deltaX,
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
    var offset = _currentDraggable.offset();

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
      .onInteractionDown(onDown, _namespace);

    _currentDraggable = null;
    _dragData = null;

    _options = null;
    _contextDelay = null;
    _dragHandler = null;
    _moveHandler = null;
    _dropHandler = null;
    _cancelHandler = null;
  }

  function onCancel(e) {
    var relatedTarget = e.originalEvent.relatedTarget,
        isDefaultPrevented = false,
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
        .onInteractionDown(onDown, _namespace);
    }

    _currentDraggable = null;
    _dragData = null;

    _options = null;
    _contextDelay = null;
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
  //    contextDelay: delay before firing context callback (default 2000ms)
  //    constrain: "x" or "y" to allow drag only horizontally or vertically
  $.fn.draggable = function draggable(options) {
    var self = this;

    if (options === false) {
      return self
        .offInteractionDown(_namespace);
    } else {
      return self
        .dragOptions(options || {})
        .onInteractionDown(onDown, _namespace);
    }
  };

}(this, this.Interaction, this.jQuery));
