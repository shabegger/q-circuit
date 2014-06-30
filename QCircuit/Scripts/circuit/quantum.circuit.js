/// <reference path="quantum.js" />
/// <reference path="quantum.workspace.js" />
/// <reference path="quantum.factoryshowroom.js" />
/// <reference path="quantum.slot.js" />

; (function (window, Q, SVG, undefined) {

  'use strict';


  /* Constructor */

  function Circuit(workspace, registerSize) {
    var self = this;

    self.workspace = workspace;
    self.slots = [];

    self.render(registerSize);
  }


  /* Prototype Methods */

  Circuit.prototype.render = function render(registerSize) {
    var self = this,
        workspace = self.workspace,
        slots = self.slots,
        svg = self.svg,
        i;

    if (svg) {
      svg.remove();
    }

    while (slots.length) {
      slots.pop();
    }

    svg = self.svg = workspace.svg.nested().attr({
      x: 0,
      y: Q.FactoryShowroom.HEIGHT,
      width: '100%'
    });

    for (i = 0; i < registerSize; i++) {
      slots.push(new Q.Slot(self, i));
    }
  };

  Circuit.prototype.tryAcceptGate = function tryAcceptGate(gate) {
    var self = this,
        slots = self.slots,
        i, len;

    for (i = 0, len = slots.length; i < len; i++) {
      if (slots[i].tryAcceptGate(gate)) {
        return true;
      }
    }

    return false;
  };


  /* Expose */

  Q.Circuit = Circuit;

}(this, this.Quantum, this.SVG));