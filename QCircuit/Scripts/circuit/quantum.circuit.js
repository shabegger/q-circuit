/// <reference path="../dialog/dialog.js" />
/// <reference path="../interaction/interaction.js" />
/// <reference path="../interaction/interaction.intersect.js" />
/// <reference path="../interaction/interaction.scroll.js" />
/// <reference path="../mixins/mixins.js" />
/// <reference path="../mixins/mixins.events.js" />s
/// <reference path="quantum.js" />
/// <reference path="quantum.gate.js" />
/// <reference path="quantum.slot.js" />
/// <reference path="quantum.workspace.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, M, $, undefined) {

  'use strict';


  /* Private Variables */

  var _maxSlots = 6,
      _classUp = 'q-circuit-up',
      _classDown = 'q-circuit-down',
      _classScroller = 'q-circuit-scroller',
      _classContent = 'q-circuit-content',
      _classDelete = 'q-circuit-delete',
      _classDeletes = 'q-circuit-deletes',
      _classSlots = 'q-circuit-slots';


  /* Templates */

  function _circuitTmpl() {
    return [
      '<div class="q-circuit">',
        '<div class="', _classScroller, '">',
          '<div class="', _classContent, '">',
            '<div class="', _classDeletes, '"></div>',
            '<div class="', _classSlots, '"></div>',
          '</div>',
        '</div>',
        '<a class="', _classUp, '"></a>',
        '<a class="', _classDown, '"></a>',
		  '</div>'].join('');
  }

  function _deleteTmpl() {
    return [
      '<span class="', _classDelete, '">',
      '</span>'].join('');
  }


  /* Constructor */

  function Circuit() {
    var self = this,
        vars;

    M.Events.mixinEvents(self);

    vars = {
      slots: []
    };

    vars.saveDlg = new Dialog({
      title: 'Save New Circuit As...',
      content: '<label>Name</label><input type="text">',
      tools: [
        {
          title: 'Cancel',
          callback: $.proxy(saveDlgCancel, self, vars)
        },
        {
          title: 'Save',
          callback: $.proxy(saveDlgSave, self, vars)
        }
      ]
    });

    self.addSlot = $.proxy(addSlot, self, vars);
    self.removeSlot = $.proxy(removeSlot, self, vars);
    self.calculateScrollMax = $.proxy(calculateScrollMax, self, vars);
    self.updateScrollButtons = $.proxy(updateScrollButtons, self, vars);
    self.invalidateDropTargets = $.proxy(invalidateDropTargets, self, vars);

    self.save = $.proxy(save, self, vars);
    self.openNew = $.proxy(openNew, self, vars);

    self.slotAdded = $.proxy(slotAdded, self, vars);
    self.deleteClicked = $.proxy(deleteClicked, self, vars);
    self.scrolled = $.proxy(scrolled, self, vars);

    self.render();
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

    self.element.find(['.', _classScroller].join(''))
      .scrollable({
        up: self.element.find(['.', _classUp].join('')),
        down: self.element.find(['.', _classDown].join(''))
      })
      .on('scroll', self.scrolled);

    $(window).on('resize', self.calculateScrollMax);
  };

  Circuit.prototype.desiredHeight = function desiredHeight() {
    var self = this,
        content = self.element.find(['.', _classContent].join(''));

    return content.outerHeight();
  };

  Circuit.prototype.actualHeight = function actualHeight() {
    var self = this,
        element = self.element;

    return element.innerHeight();
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

      self.dispatchEvent('slotsChanged');
    }

    self.calculateScrollMax();
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

  function save(vars) {
    vars.saveDlg.show();
  }

  function openNew(vars) {
    var self = this,
        slots = vars.slots;

    while (!slots[0].isAddSlot()) {
      self.removeSlot(0);
    }
  }

  function calculateScrollMax(vars) {
    var self = this,
        scrollerHeight,
        scrolleeHeight;

    scrollerHeight =
      self.element.find(['.', _classScroller].join('')).innerHeight();
    scrolleeHeight =
      self.element.find(['.', _classContent].join('')).outerHeight();

    vars.scrollMax = Math.max(0, scrolleeHeight - scrollerHeight);
    self.updateScrollButtons();
  }

  function updateScrollButtons(vars) {
    var self = this,
        scrollValue;

    scrollValue =
      self.element.find(['.', _classScroller].join('')).scrollTop();

    if (scrollValue === 0) {
      self.element.find(['.', _classUp].join('')).hide();
    } else {
      self.element.find(['.', _classUp].join('')).show();
    }

    if (scrollValue >= vars.scrollMax) {
      self.element.find(['.', _classDown].join('')).hide();
    } else {
      self.element.find(['.', _classDown].join('')).show();
    }
  }

  function invalidateDropTargets(vars) {
    var slots = vars.slots,
        i, len;

    for (i = 0, len = slots.length; i < len; i++) {
      slots[i].invalidateBounds();
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

  function scrolled(vars, e) {
    var self = this,
        slots = vars.slots,
        i, len;

    for (i = 0, len = slots.length; i < len; i++) {
      slots[i].invalidateBounds();
    }

    self.updateScrollButtons();
  }

  function saveDlgCancel(vars, e) {
    var dialog = vars.saveDlg;

    dialog.hide();
  }

  function saveDlgSave(vars, e) {
    var dialog = vars.saveDlg,
        slots = vars.slots,
        i, len,
        circuit;

    circuit = {
      Name: dialog.content().find('input').val(),
      Slots: []
    };

    for (i = 0, len = slots.length; i < len; i++) {
      if (!slots[i].isAddSlot()) {
        circuit.Slots.push($.extend(slots[i].serialize(), {
          SlotNumber: i
        }));
      }
    }

    $.post('api/circuits', circuit)
      .done(function () {
        debugger;
        // TODO: Indicate successful save
        dialog.hide();
      })
      .fail(function () {
        debugger;
        // TODO: Handle error
      });
  }


  /* Expose */

  Q.Circuit = Circuit;

}(this, this.Quantum, this.Mixins, this.jQuery));
