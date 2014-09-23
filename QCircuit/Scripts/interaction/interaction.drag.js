/// <reference path="interaction.js" />
/// <reference path="interaction.touch.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, UI, $, undefined) {

  'use strict';


  /* Private Variables */

  var _namespace = 'interaction-drag';


  /* Event Handlers */

  function onDown(e) {
    var self = $(this),
        offset = self.offset(),
        top = offset.top,
        left = offset.left;

    self
      .offInteractionDown(_namespace)
      .remove()
      .css({
        'position': 'absolute',
        'top': top,
        'left': left
      })
      .appendTo('body')
      .data(_namespace, {
        deltaX: left - e.x,
        deltaY: top - e.y,
        position: self.css('position'),
        top: self.css('top'),
        left: self.css('left'),
        parent: self.parent()
      })
      .onInteractionMove(onMove, _namespace)
      .onInteractionUp(onUp, _namespace)
      .onInteractionCancel(onCancel, _namespace);
  }

  function onMove(e) {
    var self = $(this),
        dragData = self.data(_namespace);

    self
      .css({
        'top': e.y + dragData.deltaY,
        'left': e.x + dragData.deltaX
      });
  }

  function onUp(e) {
    var self = $(this);

    self
      .offInteractionMove(_namespace)
      .offInteractionUp(_namespace)
      .offInteractionCancel(_namespace)
      .onInteractionDown(onDown, _namespace);
  }

  function onCancel(e) {
    var self = $(this),
        dragData = self.data(_namespace);

    self
      .offInteractionMove(_namespace)
      .offInteractionUp(_namespace)
      .offInteractionCancel(_namespace)
      .remove()
      .css({
        'position': dragData.position,
        'top': dragData.top,
        'left': dragData.left
      })
      .appendTo(dragData.parent)
      .onInteractionDown(onDown, _namespace);
  }


  /* jQuery Plugins */

  $.fn.draggable = function draggable() {
    var self = this;

    return self.onInteractionDown(onDown, _namespace);
  };

}(this, this.Interaction, this.jQuery));