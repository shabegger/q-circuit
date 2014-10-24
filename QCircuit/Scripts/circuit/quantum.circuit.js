/// <reference path="../interaction/interaction.js" />
/// <reference path="../interaction/interaction.intersect.js" />
/// <reference path="quantum.js" />
/// <reference path="quantum.gate.js" />
/// <reference path="quantum.slot.js" />
/// <reference path="quantum.workspace.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Private Variables */

  var _maxSlots = 6,
      _classDeletes = 'q-circuit-deletes',
      _classSlots = 'q-circuit-slots';


  /* Templates */

  function _circuitTmpl() {
    return [
		  '<div class="q-circuit">',
        '<div class="q-circuit-content">',
          '<div class="', _classDeletes, '"></div>',
          '<div class="', _classSlots, '"></div>',
        '</div>',
		  '</div>'].join('');
  }

  function _deleteTmpl() {
    return [
      '<span class="q-circuit-delete">',
      '</span>'].join('');
  }


  /* Constructor */

  function Circuit(slotCount) {
    var self = this,
        vars;

    vars = {
      slots: []
    };

    self.addSlot = $.proxy(addSlot, self, vars);
    self.removeSlot = $.proxy(removeSlot, self, vars);

    self.render(slotCount);
  }


  /* Prototype Methods */

  Circuit.prototype.render = function render(slotCount) {
    var self = this,
        i, slot;

    if (!self.element) {
      self.element = $(_circuitTmpl());
    }

    self.element
      .find(['.', _classDeletes, ', .', _classSlots].join(''))
      .empty();

    for (i = 0; i < slotCount; i++) {
      self.addSlot();
    }
  };


  /* Instance Methods */

  function addSlot(vars) {
    var self = this,
        slots = vars.slots,
        deletesElem, i,
        slotsElem, slot;

    if (slots.length < _maxSlots) {
      deletesElem = self.element.find(['.', _classDeletes].join(''));
      slotsElem = self.element.find(['.', _classSlots].join(''));

      i = slots.length;

      slot = new Q.Slot();
      slots.push(slot);

      slotsElem.append(slot.element);
      $(_deleteTmpl()).appendTo(deletesElem).on('click', function () {
        self.removeSlot(i);
      });
    }
  };

  function removeSlot(vars, i) {
    var self = this,
        slots = vars.slots,
        deletesElem,
        slotsElem,
        j, len;

    if (i >= 0 && i < slots.length) {
      deletesElem = self.element.find(['.', _classDeletes].join(''));
      slotsElem = self.element.find(['.', _classSlots].join(''));

      slots.splice(i, 1);

      slotsElem.children().eq(i).remove();
      deletesElem.children().eq(i).off('click').remove();

      for (j = i, len = slots.length; j < len; j++) {
        slots[j].invalidateBounds();
      }
    }
  }


  /* Expose */

  Q.Circuit = Circuit;

}(this, this.Quantum, this.jQuery));
