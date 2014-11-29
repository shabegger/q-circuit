/// <reference path="../mixins/mixins.js" />
/// <reference path="../mixins/mixins.events.js" />s
/// <reference path="quantum.js" />
/// <reference path="quantum.circuit.js" />
/// <reference path="quantum.factoryshowroom.js" />
/// <reference path="quantum.gate.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, M, $, undefined) {

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
      })
      .fail(function () {
        // TODO: Handle error
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
  }


  /* Expose */

  Q.Workspace = Workspace;

}(this, this.Quantum, this.Mixins, this.jQuery));
