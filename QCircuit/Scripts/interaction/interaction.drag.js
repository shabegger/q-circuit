/// <reference path="interaction.js" />
/// <reference path="interaction.touch.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, UI, $, undefined) {

  'use strict';


  /* Private Variables */

  var _namespace = 'interaction-drag',
      _body = $('body'),
      _currentDraggable = null,
      _dragData = null;


  /* Event Handlers */

  function onDown(e) {
    var offset, top, left;

    _currentDraggable = $(this);

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
  }

  function onMove(e) {
    _currentDraggable
      .css({
        'top': e.y + _dragData.deltaY,
        'left': e.x + _dragData.deltaX
      });
  }

  function onUp(e) {
    _body
      .offInteractionMove(_namespace)
      .offInteractionUp(_namespace)
      .offInteractionCancel(_namespace);

    _currentDraggable
      .onInteractionDown(onDown, _namespace);

    _currentDraggable = null;
    _dragData = null;
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

    _currentDraggable
      .remove()
      .css({
        'position': _dragData.position,
        'top': _dragData.top,
        'left': _dragData.left
      })
      .appendTo(_dragData.parent)
      .onInteractionDown(onDown, _namespace);

    _currentDraggable = null;
    _dragData = null;
  }


  /* jQuery Plugins */

  $.fn.draggable = function draggable() {
    var self = this;

    return self.onInteractionDown(onDown, _namespace);
  };

}(this, this.Interaction, this.jQuery));
