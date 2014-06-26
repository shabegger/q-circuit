/// <reference path="quantum.js" />
/// <reference path="quantum.workspace.js" />
/// <reference path="quantum.gate.js" />

; (function (window, Q, SVG, undefined) {

  'use strict';


  /* Constructor */

  // parent is optional
  function GateFactory(workspace, gateConstructor, x, y, parent) {
    var self = this;

    self.workspace = workspace;
    self.parent = parent || null;
    self.gateConstructor = gateConstructor;

    self.render(x, y);
    self.generateGate();
  }


  /* Prototype Methods */

  GateFactory.prototype.render = function render(x, y) {
    var self = this,
        gateConstructor = self.gateConstructor;

    gateConstructor.prototype.render.call(self, x, y);
  };

  GateFactory.prototype.generateGate = function generateGate() {
    var self = this,
        workspace = self.workspace,
        parent = self.parent,
        gateConstructor = self.gateConstructor,
        svg = self.svg,
        rbox = svg.rbox(),
        x = rbox.x,
        y = rbox.y,
        gate = new gateConstructor(workspace, x, y, parent);

    gate.addEventListener('dragStart', function () {
      self.generateGate();
    });

    gate.addEventListener('dragEnd', function () {
      gate.removeEventListener('dragStart');
      gate.removeEventListener('dragEnd');
    });
  };


  /* Expose */

  Q.GateFactory = GateFactory;

}(this, this.Quantum, this.SVG));