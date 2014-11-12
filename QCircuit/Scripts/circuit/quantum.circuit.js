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
      _classDelete = 'q-circuit-delete',
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
      '<span class="', _classDelete, '">',
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

    self.slotAdded = $.proxy(slotAdded, self, vars);
    self.deleteClicked = $.proxy(deleteClicked, self, vars);

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

    self.element
      .find(['.', _classDeletes].join(''))
      .on('click', ['.', _classDelete].join(''), self.deleteClicked);

    for (i = 0; i < slotCount; i++) {
      self.addSlot();
    }

    self.addSlot(true);
  };


  /* Instance Methods */

  function addSlot(vars, addSlot) {
    var self = this,
        slots = vars.slots,
        deletesElem, slotsElem,
        slot, lastSlot;

    if (slots.length < _maxSlots) {
      deletesElem = self.element.find(['.', _classDeletes].join(''));
      slotsElem = self.element.find(['.', _classSlots].join(''));

      lastSlot = slots.length && slots[slots.length - 1];
      if (addSlot) {
        if (!lastSlot || !lastSlot.isAddSlot()) {
          slot = new Q.Slot(true);
          slot.addEventListener('added', self.slotAdded);
        }
      } else {
        slot = new Q.Slot();
      }

      if (slot) {
        slots.push(slot);
        slotsElem.append(slot.element);

        $(_deleteTmpl()).appendTo(deletesElem).css({
          'visibility': addSlot ? 'hidden' : 'visible'  
        });
      }
    }
  };

  function removeSlot(vars, i) {
    var self = this,
        slots = vars.slots,
        slot,
        deletesElem,
        slotsElem,
        j, len;

    if (i >= 0 && i < slots.length) {
      deletesElem = self.element.find(['.', _classDeletes].join(''));
      slotsElem = self.element.find(['.', _classSlots].join(''));

      slot = slots[i];
      slots.splice(i, 1);

      slot.dispose();
      deletesElem.children(':last-child').remove();

      for (j = i, len = slots.length; j < len; j++) {
        slots[j].invalidateBounds();
      }

      // If previously at the max slot count, we now need an add slot
      self.addSlot(true);

      // If there's an add slot, make sure it's delete is hidden
      if (slots[slots.length - 1].isAddSlot()) {
        self.element.find(['.', _classDelete, ':last'].join('')).css({
          'visibility': 'hidden'
        });
      }
    }
  }


  /* Event Handlers */

  function slotAdded(vars, e) {
    var self = this,
        slot = e.sender;

    self.element.find(['.', _classDelete].join('')).css({
      'visibility': 'visible'
    });

    slot.removeEventListener('added');
    self.addSlot(true);
  }

  function deleteClicked(vars, e) {
    var self = this,
        btn = $(e.target);

    self.removeSlot(btn.index());
  }


  /* Expose */

  Q.Circuit = Circuit;

}(this, this.Quantum, this.jQuery));
