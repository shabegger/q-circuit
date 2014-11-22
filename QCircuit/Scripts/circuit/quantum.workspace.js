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

    self.circuit = new Q.Circuit(5);
    self.element.append(self.circuit.element);
    self.circuit.calculateScrollMax();

    self.element.on('scroll', self.circuit.scrolled);
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
      })
      .fail(function () {
        // TODO: Handle error
      });
  };


  /* Expose */

  Q.Workspace = Workspace;

}(this, this.Quantum, this.Mixins, this.jQuery));
