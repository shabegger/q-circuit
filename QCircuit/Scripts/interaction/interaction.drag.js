/// <reference path="interaction.js" />
/// <reference path="interaction.touch.js" />
/// <reference path="interaction.drop.js" />
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
    var offset, top, left;

    _currentDraggable = $(this);

    _options = _currentDraggable.data(_namespace);
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
      position: _currentDraggable.css('position'),
      top: _currentDraggable.css('top'),
      left: _currentDraggable.css('left'),
      parent: _currentDraggable.parent()
    };

    _currentDraggable
      .offInteractionDown(_namespace)
      .remove()
      .css({
        'position': 'absolute',
        'top': top,
        'left': left
      });

    _body
      .onInteractionMove(onMove, _namespace)
      .onInteractionUp(onUp, _namespace)
      .onInteractionCancel(onCancel, _namespace)
      .append(_currentDraggable);

    _currentDraggable.data(_namespace, _options);

    _dragHandler && _dragHandler.call(_currentDraggable, {
      top: top,
      left: left
    });
  }

  function onMove(e) {
    var top = e.y + _dragData.deltaY,
        left = e.x + _dragData.deltaX;

    _currentDraggable
      .css({
        'top': top,
        'left': left
      });

    _moveHandler && _moveHandler.call(_currentDraggable, {
      top: top,
      left: left
    });
  }

  function onUp(e) {
    _body
      .offInteractionMove(_namespace)
      .offInteractionUp(_namespace)
      .offInteractionCancel(_namespace);

    _currentDraggable
      .onInteractionDown(onDown, _namespace);

    _dropHandler && _dropHandler.call(_currentDraggable);

    _currentDraggable = null;
    _dragData = null;

    _options = null;
    _dragHandler = null;
    _moveHandler = null;
    _dropHandler = null;
    _cancelHandler = null;
  }

  function onCancel(e) {
    var relatedTarget = e.originalEvent.relatedTarget;

    if (relatedTarget && relatedTarget.tagName !== 'HTML') {
      return;
    }

    _body
      .offInteractionMove(_namespace)
      .offInteractionUp(_namespace)
      .offInteractionCancel(_namespace);

    if (_cancelHandler && _cancelHandler.call(_currentDraggable)) {
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
        .onInteractionDown(onDown, _namespace)
        .data(_namespace, _options);
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

  //  options - if false, remove drag
  //    drag: callback function called when drag starts
  //    move: callback function called when moved
  //    drop: callback function called when dropped
  //    cancel: callback function called when drag cancelled
  $.fn.draggable = function draggable(options) {
    var self = this;

    if (options === false) {
      return self
        .data(_namespace, null)
        .offInteractionDown(_namespace);
    } else {
      return self
        .data(_namespace, options)
        .onInteractionDown(onDown, _namespace);
    }
  };

}(this, this.Interaction, this.jQuery));
