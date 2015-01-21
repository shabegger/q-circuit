/// <reference path="../common/guid.js" />
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

; (function (window, Page, Q, M, X, $, undefined) {

  'use strict';


  /* Private Variables */

  var _instance = null,
      _maxSlots = 6,
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

  function _circuitListTmpl(circuit) {
    return [
      '<option value="', (circuit && circuit.Id) || '', '">',
        (circuit && circuit.Name) || '',
      '</option>'
    ].join('');
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

    vars.openDlg = new Dialog({
      title: 'Open Existing...',
      content: '<label>Circuit</label><select></select>',
      tools: [
        {
          title: 'Cancel',
          callback: $.proxy(openDlgCancel, self, vars)
        },
        {
          title: 'Open',
          callback: $.proxy(openDlgOpen, self, vars)
        }
      ]
    });

    self.slots = $.proxy(slots, self, vars);
    self.addSlot = $.proxy(addSlot, self, vars);
    self.removeSlot = $.proxy(removeSlot, self, vars);
    self.calculateScrollMax = $.proxy(calculateScrollMax, self, vars);
    self.updateScrollButtons = $.proxy(updateScrollButtons, self, vars);
    self.invalidateDropTargets = $.proxy(invalidateDropTargets, self, vars);
    self.update = $.proxy(update, self, vars);

    self.save = $.proxy(save, self, vars);
    self.copy = $.proxy(copy, self, vars);
    self.open = $.proxy(open, self, vars);
    self.openNew = $.proxy(openNew, self, vars);
    self.remove = $.proxy(remove, self, vars);

    self.slotAdded = $.proxy(slotAdded, self, vars);
    self.deleteClicked = $.proxy(deleteClicked, self, vars);
    self.scrolled = $.proxy(scrolled, self, vars);

    vars.saveDone = $.proxy(saveDone, self, vars);
    vars.openDone = $.proxy(openDone, self, vars);
    vars.deleteDone = $.proxy(deleteDone, self, vars);

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

  function slots(vars) {
    return vars.slots.slice();
  }

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
        needsNew,
        j, len;

    if (i >= 0 && i < slots.length) {
      deletesElem = self.element.find(['.', _classDeletes].join(''));
      slotsElem = self.element.find(['.', _classSlots].join(''));

      slot = slots[i];
      slots.splice(i, 1);

      needsNew = !slot.isAddSlot();

      slot.dispose();
      deletesElem.children(':last-child').remove();

      for (j = i, len = slots.length; j < len; j++) {
        slots[j].invalidateBounds();
      }

      // If previously at the max slot count, we now need an add slot
      if (needsNew) {
        self.addSlot(true);
      }

      // If there's an add slot, make sure it's delete is hidden
      if (slots.length && slots[slots.length - 1].isAddSlot()) {
        self.element.find(['.', _classDelete, ':last'].join('')).css({
          'visibility': 'hidden'
        });
      }
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

  function update(vars, circuit) {
    var slots = vars.slots,
        i, len, slot;

    vars.id = circuit.Id;
    vars.name = circuit.Name;
    for (i = 0, len = circuit.Slots.length; i < len; i++) {
      slot = circuit.Slots[i];
      slots[slot.SlotNumber].update(slot);
    }
  }

  function save(vars) {
    var self = this;

    if (!vars.id || vars.id === Guid.Empty) {
      vars.saveDlg.show();
    } else {
      saveDlgSave.call(self, vars);
    }
  }

  function copy(vars) {
    if (vars.id) {
      $.post('api/circuits/' + vars.id)
        .done(vars.saveDone)
        .fail(ajaxFail);
    }
  }

  function open(vars) {
    X.Spinner().show();

    $.get('api/circuits')
      .done(function (circuits) {
        var i, len,
            select = vars.openDlg.content().find('select');

        select.empty();

        select.append(_circuitListTmpl());
        for (i = 0, len = circuits.length; i < len; i++) {
          select.append(_circuitListTmpl(circuits[i]));
        }

        X.Spinner().hide();
        vars.openDlg.show();
      })
      .fail(ajaxFail);
  }

  function openNew(vars) {
    var self = this,
        slots = vars.slots;

    delete vars.id;
    delete vars.name;

    while (!slots[0].isAddSlot()) {
      self.removeSlot(0);
    }
  }

  function remove(vars) {
    var self = this;

    if (vars.id && vars.id !== Guid.Empty) {
      X.Spinner().show();
      $.ajax('api/circuits/' + vars.id, { type: 'DELETE' })
        .done(vars.deleteDone)
        .fail(ajaxFail);
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
    var self = this,
        dialog = vars.saveDlg,
        slots = vars.slots,
        i, len,
        circuit, name;

    circuit = {
      Id: vars.id || Guid.Empty,
      Slots: []
    };

    if (!vars.id || vars.id === Guid.Empty) {
      name = dialog.content().find('input').val();

      if (!name) {
        Page.showMessage('Name is required.');
        return;
      }

      circuit.Name = name;
    } else {
      circuit.Name = vars.name;
    }

    for (i = 0, len = slots.length; i < len; i++) {
      if (!slots[i].isAddSlot()) {
        circuit.Slots.push($.extend(slots[i].serialize(), {
          SlotNumber: i
        }));
      }
    }

    dialog.hide();
    dialog.content().find('input').val('');

    X.Spinner().show();

    if (!vars.id || vars.id === Guid.Empty) {
      $.post('api/circuits', circuit)
        .done(vars.saveDone)
        .fail(ajaxFail);
    } else {
      $.ajax('api/circuits/' + vars.id, { data: circuit, type: 'PUT' })
        .done(vars.saveDone)
        .fail(ajaxFail);
    }
  }

  function openDlgCancel(vars, e) {
    var dialog = vars.openDlg;

    dialog.hide();
  }

  function openDlgOpen(vars, e) {
    var self = this,
        dialog = vars.openDlg,
        id = dialog.content().find('option:selected').val();

    if (!id) {
      Page.showMessage('Select a circuit to open.');
      return;
    }

    dialog.hide();

    X.Spinner().show();

    $.get('api/circuits/' + id)
      .done(vars.openDone)
      .fail(ajaxFail);
  }


  /* AJAX Callbacks */

  function saveDone(vars, circuit) {
    var self = this;

    if (circuit.Message) {
      Page.showMessage(circuit.Message);
    } else {
      self.update(circuit);
      Page.showMessage('Save successful!');
    }

    X.Spinner().hide();
  }

  function openDone(vars, circuit) {
    var self = this,
        slots = vars.slots,
        i, len;

    while (slots.length) {
      self.removeSlot(0);
    }

    vars.id = circuit.Id;
    vars.name = circuit.Name;

    for (i = 0, len = circuit.Slots.length; i < len; i++) {
      self.addSlot();
      slots[i].open(circuit.Slots[i]);
    }

    self.addSlot(true);

    X.Spinner().hide();
  }

  function deleteDone() {
    var self = this;

    self.openNew();

    Page.showMessage('Delete successful!');
    X.Spinner().hide();
  }

  function ajaxFail(request, status, error) {
    Page.showMessage(error);
    X.Spinner().hide();
  }


  /* Singleton */

  function getInstance() {
    _instance = _instance || new Circuit();
    return _instance;
  }


  /* Expose */

  Q.Circuit = getInstance;

}(this, this.MainPage, this.Quantum, this.Mixins, this.UX, this.jQuery));
