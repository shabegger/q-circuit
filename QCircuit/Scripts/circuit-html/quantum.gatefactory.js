/// <reference path="quantum.js" />
/// <reference path="quantum.gate.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Templates */

  function _gateFactoryTmpl() {
    return [
		  '<div class="q-gateFactory">',
		  '</div>'].join('');
  }


  /* Constructor */

  function GateFactory(gateConstructor) {
    var self = this;

    self.gateConstructor = gateConstructor;

    self.render();
    self.generateGate();
  }


  /* Prototype Methods */

  GateFactory.prototype.render = function render() {
    var self = this;

    if (!self.element) {
      self.element = $(_gateFactoryTmpl());
    }

    self.element.empty();
  };

  GateFactory.prototype.generateGate = function generateGate() {
    var self = this,
        gateConstructor = self.gateConstructor,
        gate = new gateConstructor();

    self.element.append(gate.element);
  };


  /* Expose */

  Q.GateFactory = GateFactory;

}(this, this.Quantum, this.jQuery));
