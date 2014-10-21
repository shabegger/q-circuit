/// <reference path="quantum.js" />
/// <reference path="quantum.gate.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Private Variables */

  var _className = 'q-gateFactory',
      _classModItemPrefix = 'q-mod-item-';


  /* Templates */

  function _gateFactoryTmpl() {
    return [
		  '<div class="', _className, '">',
		  '</div>'].join('');
  }


  /* Constructor */

  function GateFactory(gateConstructor) {
    var self = this;

    self.gateConstructor = gateConstructor;

    self.drag = $.proxy(drag, self);

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

  GateFactory.prototype.position = function position() {
    var self = this,
        element = self.element,
        i = element.index();

    element.removeClass().addClass([
      _className,
      _classModItemPrefix + i
    ].join(' '));
  };

  GateFactory.prototype.generateGate = function generateGate() {
    var self = this,
        gateConstructor = self.gateConstructor,
        gate = new gateConstructor();

    self.element.append(gate.element);

    gate.addEventListener('drag', self.drag);
  };


  /* Event Handlers */

  function drag(e) {
    var self = this,
        gate = e.sender;

    gate.removeEventListener('drag', self.drag);

    self.generateGate();
  }


  /* Expose */

  Q.GateFactory = GateFactory;

}(this, this.Quantum, this.jQuery));
