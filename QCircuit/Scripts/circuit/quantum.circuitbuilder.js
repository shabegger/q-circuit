﻿/// <reference path="quantum.js" />
/// <reference path="quantum.workspace.js" />
/// <reference path="quantum.factoryshowroom.js" />
/// <reference path="quantum.circuit.js" />

; (function (window, Q, SVG, undefined) {

  'use strict';


  /* Constructor */

  function CircuitBuilder(elementId, registerSize, gateConstructors) {
    var self = this,
        workspace,
        showroom,
        circuit;

    workspace = self.workspace = new Q.WorkSpace(elementId);
    
    showroom = self.showroom = new Q.FactoryShowroom(workspace, gateConstructors);
    circuit = self.circuit = new Q.Circuit(workspace, registerSize);

    showroom.addEventListener('dragStart', function () {
      gateDrag.apply(self, arguments);
    });
  }


  /* Event Handlers */

  function gateDrag(e) {
    var self = this,
        workspace = self.workspace,
        gate = e.gate;

    workspace.svg.add(gate.svg);

    gate.addEventListener('dragEnd', function () {
      gateDrop.apply(self, arguments);
    });
  }

  function gateDrop(e) {
    var self = this,
        circuit = self.circuit,
        gate = e.sender;

    if (circuit.tryAcceptGate(gate, e.finalAttributes)) {
      e.accepted = true;
    } else {
      gate.removeEventListener('dragEnd');
    }    
  }


  /* Expose */

  Q.CircuitBuilder = CircuitBuilder;

}(this, this.Quantum, this.SVG));