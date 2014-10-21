﻿/// <reference path="../interaction/interaction.js" />
/// <reference path="../interaction/interaction.intersect.js" />
/// <reference path="quantum.js" />
/// <reference path="quantum.gate.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Private Variables */

  var _classModHover = 'q-mod-hover',
      _classContent = 'q-slot-content';


  /* Templates */

  function _slotTmpl() {
    return [
		  '<div class="q-slot">',
        '<div class="', _classContent, '"></div>',
		  '</div>'].join('');
  }


  /* Constructor */

  function Slot() {
    var self = this,
        vars;

    vars = {
      gates: {}
    };

    self.gateDragged = $.proxy(gateDragged, self, vars);
    self.gateDropped = $.proxy(gateDropped, self, vars);
    self.gateCanceled = $.proxy(gateCanceled, self, vars);
    self.slotGateDragged = $.proxy(slotGateDragged, self, vars);
    self.invalidateBounds = $.proxy(invalidateBounds, self, vars);

    Q.Gate.addEventListener('drag', self.gateDragged);
    Q.Gate.addEventListener('move', self.gateDragged);

    $(window).on('resize', self.invalidateBounds);

    self.render();
  }


  /* Prototype Methods */

  Slot.prototype.render = function render() {
    var self = this;

    if (!self.element) {
      self.element = $(_slotTmpl());
    }

    self.element.find([':not(".', _classContent, '")'].join('')).remove();
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
      gate.addEventListener('cancel', self.gateCanceled);
    } else {
      self.element.removeClass(_classModHover);
      gate.removeEventListener('drop', self.gateDropped);
      gate.removeEventListener('cancel', self.gateCanceled);
    }
  }

  function slotGateDragged(vars, e) {
    var self = this,
        gate = e.sender;

    removeGate(vars.gates, gate);
    gate.removeEventListener('drag', self.slotGateDragged);
  }

  function gateDropped(vars, e) {
    var self = this,
        element = self.element.find(['.', _classContent].join('')),
        gate = e.sender,
        gateElement = gate.element,
        width = element.innerWidth(),
        beforeOffset, afterOffset,
        top, left, position;

    // Offset before moving gate to slot
    beforeOffset = gateElement.offset();

    gateElement
      .remove()
      .css({
        'position': 'absolute',
        'top': 'auto',
        'left': 'auto'
      })
      .appendTo(element);

    // Offset after moving gate to slot
    afterOffset = gateElement.offset();

    // Position needed to move gate back to where it was
    top = beforeOffset.top - afterOffset.top;
    left = beforeOffset.left - afterOffset.left;

    gateElement
      .css({
        'top': top,
        'left': left
      });

    // New position of gate in slot
    top = 0;
    left = Math.max(0, Math.min(width, left));

    position = left / width;

    gateElement
      .animate({
        'top': top,
        'left': left
      }, 200, function () {
        // Position gate relatively in slot
        gateElement.css({
          'left': (100 * position) + '%'
        })
      });

    self.element.removeClass(_classModHover);
    gate.removeEventListener('drop', self.gateDropped);
    gate.removeEventListener('cancel', self.gateCanceled);

    insertGate(vars.gates, gate, position);
    gate.addEventListener('drag', self.slotGateDragged);

    e.handled = true;
  }

  function gateCanceled(vars, e) {
    var self = this,
        gate = e.sender;

    self.element.removeClass(_classModHover);
    gate.removeEventListener('drop', self.gateDropped);
    gate.removeEventListener('cancel', self.gateCanceled);
  }

  function invalidateBounds(vars, e) {
    vars.bounds = null;
  }


  /* Helpers */

  function insertGate(gates, gate, position) {
    var key = Math.floor(position * 100000000);

    while (gates[key]) {
      key++;
    }

    gates[key] = gate;
  }

  function removeGate(gates, gate) {
    var key;

    for (key in gates) {
      if (gates[key] === gate) {
        delete gates[key];
        break;
      }
    }
  }


  /* Expose */

  Q.Slot = Slot;

}(this, this.Quantum, this.jQuery));
