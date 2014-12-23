/// <reference path="../common/guid.js" />
/// <reference path="../interaction/interaction.js" />
/// <reference path="../interaction/interaction.intersect.js" />
/// <reference path="quantum.js" />
/// <reference path="quantum.gate.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, M, $, undefined) {

  'use strict';


  /* Private Variables */

  var _classModAdd = 'q-mod-add',
      _classModHover = 'q-mod-hover',
      _classContent = 'q-slot-content';


  /* Templates */

  function _slotTmpl() {
    return [
		  '<div class="q-slot">',
        '<div class="', _classContent, '"></div>',
		  '</div>'].join('');
  }


  /* Constructor */

  function Slot(isAddSlot) {
    var self = this,
        vars;

    vars = {
      isAddSlot: !!isAddSlot,
      gates: {}
    };

    M.Events.mixinEvents(self);

    self.serialize = $.proxy(serialize, self, vars);
    self.invalidateBounds = $.proxy(invalidateBounds, self, vars);
    self.update = $.proxy(update, self, vars);

    self.gateDragged = $.proxy(gateDragged, self, vars);
    self.gateDropped = $.proxy(gateDropped, self, vars);
    self.gateCanceled = $.proxy(gateCanceled, self, vars);
    self.slotGateDragged = $.proxy(slotGateDragged, self, vars);

    Q.Gate.addEventListener('drag', self.gateDragged);
    Q.Gate.addEventListener('move', self.gateDragged);

    $(window).on('resize', self.invalidateBounds);

    self.render(isAddSlot);
  }


  /* Prototype Methods */

  Slot.prototype.render = function render(isAddSlot) {
    var self = this;

    if (!self.element) {
      self.element = $(_slotTmpl());
    }

    if (isAddSlot) {
      self.element.addClass(_classModAdd);
    }

    self.element.find([':not(".', _classContent, '")'].join('')).remove();
  };

  Slot.prototype.isAddSlot = function isAddSlot() {
    var self = this,
        element = self.element;

    return element.hasClass(_classModAdd);
  };

  Slot.prototype.dispose = function dispose() {
    var self = this;

    Q.Gate.removeEventListener('drag', self.gateDragged);
    Q.Gate.removeEventListener('move', self.gateDragged);

    self.element.remove();
  };


  /* Instance Methods */

  function serialize(vars) {
    var self = this,
        gates = vars.gates,
        key,
        position,
        slot;

    slot = {
      Id: vars.id || Guid.Empty,
      Gates: []
    };

    for (key in gates) {
      slot.Gates.push($.extend(gates[key].serialize(), {
        Position: parseFloat(key)
      }));
    }

    return slot;
  }

  function invalidateBounds(vars) {
    vars.bounds = null;
  }

  function update(vars, slot) {
    var gates = vars.gates,
        i, len, gate;

    vars.id = slot.Id;
    vars.number = slot.SlotNumber;

    for (i = 0, len = slot.Gates.length; i < len; i++) {
      gate = slot.Gates[i];
      gates[gate.Position.toFixed(8)].update(gate);
    }
  }


  /* Event Handlers */

  function gateDragged(vars, e) {
    var self = this,
        bounds = vars.bounds = vars.bounds || self.element.bounds(),
        gate = e.gate,
        top = e.top,
        bottom = top + e.height,
        x = e.left + (e.width / 2);
    
    if (bounds.left < x && bounds.right > x && bounds.top < bottom && bounds.bottom > top) {
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
        top, left, topDelta, position;

    // Offset before moving gate to slot
    beforeOffset = gateElement.offset();

    gateElement
      .remove()
      .css({
        'position': 'absolute',
        'top': '',
        'left': ''
      })
      .appendTo(element);

    // Offset after moving gate to slot
    afterOffset = gateElement.offset();

    topDelta = parseInt(gateElement.css('top'), 10);
    topDelta = isNaN(topDelta) ? 0 : topDelta;

    // Position needed to move gate back to where it was
    top = beforeOffset.top + topDelta - afterOffset.top;
    left = beforeOffset.left - afterOffset.left;

    gateElement
      .css({
        'top': top,
        'left': left
      });

    // New position of gate in slot
    left = Math.max(0, Math.min(width, left));
    position = left / width;

    gateElement
      .animate({
        'top': topDelta,
        'left': left
      }, 200, function () {
        // Position gate relatively in slot
        gateElement.css({
          'top': '',
          'left': (100 * position) + '%'
        })
      });

    self.element.removeClass(_classModHover);
    gate.removeEventListener('drop', self.gateDropped);
    gate.removeEventListener('cancel', self.gateCanceled);

    insertGate(vars.gates, gate, position);
    gate.addEventListener('drag', self.slotGateDragged);

    e.handled = true;

    if (vars.isAddSlot) {
      vars.isAddSlot = false;
      self.element.removeClass(_classModAdd);
      self.dispatchEvent('added');
    }
  }

  function gateCanceled(vars, e) {
    var self = this,
        gate = e.sender;

    self.element.removeClass(_classModHover);
    gate.removeEventListener('drop', self.gateDropped);
    gate.removeEventListener('cancel', self.gateCanceled);
  }


  /* Private Helpers */

  function insertGate(gates, gate, position) {
    var n = 8,
        m = Math.pow(10, n),
        k = Math.floor(position * m) / m,
        key = k.toFixed(n);
    
    while (gates[key]) {
      k = (Math.floor(key * m) + 1) / m;
      key = k.toFixed(n);
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

}(this, this.Quantum, this.Mixins, this.jQuery));
