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
    var self = this,
        vars = {};

    self.gateDragged = $.proxy(gateDragged, self, vars);
    self.gateDropped = $.proxy(gateDropped, self, vars);

    Q.Gate.addEventListener('drag', self.gateDragged);
    Q.Gate.addEventListener('move', self.gateDragged);

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

  function gateDragged(vars, e) {
    var self = this,
        bounds = vars.bounds = vars.bounds || self.element.bounds(),
        gate = e.gate,
        x = e.centerX,
        y = e.centerY;
    
    if (bounds.left < x && bounds.right > x && bounds.top < y && bounds.bottom > y) {
      self.element.addClass(_classModHover);
      gate.addEventListener('drop', self.gateDropped);
    } else {
      self.element.removeClass(_classModHover);
      gate.removeEventListener('drop', self.gateDropped);
    }
  }

  function gateDropped(vars, e) {
    var self = this,
        bounds = vars.bounds,
        top = bounds.top,
        gate = e.sender,
        gateElement = gate.element;

    gateElement
      .animate({
        'top': top + ((bounds.bottom - top - gateElement.outerHeight()) / 2)
      }, 200, function () {
          
      });

    self.element.removeClass(_classModHover);
    gate.removeEventListener('drop', self.gateDropped);

    e.handled = true;
  }


  /* Expose */

  Q.Slot = Slot;

}(this, this.Quantum, this.jQuery));
