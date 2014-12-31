/// <reference path="../mixins/mixins.js" />
/// <reference path="../mixins/mixins.events.js" />
/// <reference path="../ux/ux.js" />
/// <reference path="../ux/ux.spinner.js" />
/// <reference path="quantum.js" />
/// <reference path="quantum.circuit.js" />
/// <reference path="quantum.factoryshowroom.js" />
/// <reference path="quantum.gate.js" />
/// <reference path="quantum.toolbar.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Page, Q, M, X, $, undefined) {

  'use strict';


  /* Templates */

  function _workspaceTmpl() {
    return [
		  '<div class="q-workspace">',
		  '</div>'].join('');
  }


  /* Constructor */

  function Workspace(container) {
    var self = this;

    self.setShowroomSize = $.proxy(setShowroomSize, self);

    self.render(container);
    self.init();
  }


  /* Prototype Methods */

  Workspace.prototype.render = function render(container) {
    var self = this;

    if (!self.element) {
      self.element = $(_workspaceTmpl()).appendTo(container);
    }

    self.element.empty();

    self.toolbar = new Q.Toolbar();
    self.element.append(self.toolbar.element);
    self.toolbar.addEventListener('itemSelect',
      $.proxy(toolbarItemSelected, self));

    self.factoryShowroom = new Q.FactoryShowroom();
    self.element.append(self.factoryShowroom.element);
    self.factoryShowroom.calculateScrollMax();

    self.circuit = new Q.Circuit();
    self.element.append(self.circuit.element);
    self.circuit.calculateScrollMax();

    self.element.on('scroll', self.circuit.scrolled);

    if (self.factoryShowroom.canResize()) {
      $(window).on('resize', self.setShowroomSize);
      self.circuit.addEventListener('slotsChanged', self.setShowroomSize);
    }
  };

  Workspace.prototype.init = function init() {
    var self = this;

    X.Spinner().show();

    $.get('/api/gates')
      .done(function (savedGates) {
        var gates = [],
            i, len;

        for (i = 0, len = savedGates.length; i < len; i++) {
          gates.push(Q.Gate.fromSavedGate(savedGates[i]));
        }

        self.factoryShowroom.addGates(gates);

        if (self.factoryShowroom.canResize()) {
          self.setShowroomSize();
        }

        X.Spinner().hide();
      })
      .fail(function (request, status, error) {
        Page.showMessage(error);
        X.Spinner().hide();
      });
  };


  /* Event Handlers */

  function setShowroomSize(e) {
    var self = this,
        showroom = self.factoryShowroom,
        circuit = self.circuit,
        currentSize, currentHeight,
        availableHeight, maxSize,
        showroomRatio;

    showroomRatio = showroom.desiredWidth() / showroom.actualWidth();
    if (showroomRatio <= 1) {
      showroom.size(1);
      return;
    }

    currentSize = showroom.size();
    currentHeight = showroom.heightForSize(currentSize);

    availableHeight = circuit.actualHeight() - circuit.desiredHeight();
    maxSize = showroom.sizeForHeight(availableHeight + currentHeight);

    showroom.size(Math.min(maxSize, showroomRatio));
    circuit.invalidateDropTargets();
  }

  function toolbarItemSelected(e) {
    var self = this;

    switch (e.action) {
      case 'new':
        self.circuit.openNew();
        break;
      case 'copy':
        self.circuit.copy();
        break;
      case 'save':
        self.circuit.save();
        break;
      case 'delete':
        self.circuit.remove();
        break;
    }
  }


  /* Expose */

  Q.Workspace = Workspace;

}(this, this.MainPage, this.Quantum, this.Mixins, this.UX, this.jQuery));
