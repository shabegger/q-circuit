/// <reference path="../interaction/interaction.js" />
/// <reference path="../interaction/interaction.intersect.js" />
/// <reference path="quantum.js" />
/// <reference path="quantum.gate.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Private Variables */

  var _classModHover = 'q-mod-hover';


  /* Templates */

  function _slotTmpl() {
    return [
		  '<div class="q-slot">',
		  '</div>'].join('');
  }


  /* Constructor */

  function Slot() {
    var self = this;

    self.gateDragged = $.proxy(gateDragged, self);
    self.gateDropped = $.proxy(gateDropped, self);

    Q.Gate.addEventListener('drag', self.gateDragged);
    Q.Gate.addEventListener('move', self.gateDragged);
    Q.Gate.addEventListener('drop', self.gateDropped);

    self.render();
  }


  /* Prototype Methods */

  Slot.prototype.render = function render() {
    var self = this,
        bounds;

    if (!self.element) {
      self.element = $(_slotTmpl());
    }

    self.element.find(':not(".q-slot-background")').remove();
  };


  /* Event Handlers */

  function gateDragged(e) {
    var self = this,
        bounds = self._bounds = self._bounds || self.element.bounds(),
        left = bounds.left,
        right = bounds.right,
        top = bounds.top,
        bottom = bounds.bottom,
        x = e.centerX,
        y = e.centerY;
    
    if (left < x && right > x && top < y && bottom > y) {
      self.element.addClass(_classModHover);
    } else {
      self.element.removeClass(_classModHover);
    }
  }

  function gateDropped(e) {
    var self = this;

    self.element.removeClass(_classModHover);
  }


  /* Expose */

  Q.Slot = Slot;

}(this, this.Quantum, this.jQuery));
