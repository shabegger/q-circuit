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

  function Workspace() { }


  /* Prototype Methods */

  Workspace.prototype.init = function init() {
    var self = this;

    return $.get('/api/gates').done(function (savedGates) {
        var gates = [],
            i, len;

        for (i = 0, len = savedGates.length; i < len; i++) {
          gates.push(Q.Gate.fromSavedGate(savedGates[i]));
        }

        self.render(gates);
      });
  };

  Workspace.prototype.render = function render(gates) {
    var self = this;

    if (!self.element) {
      self.element = $(_workspaceTmpl());
    }

    self.element.empty();

    self.factoryShowroom = new Q.FactoryShowroom(gates);
    self.element.append(self.factoryShowroom.element);

    self.circuit = new Q.Circuit(5);
    self.element.append(self.circuit.element);
  };


  /* Expose */

  Q.Workspace = Workspace;

}(this, this.Quantum, this.Mixins, this.jQuery));
