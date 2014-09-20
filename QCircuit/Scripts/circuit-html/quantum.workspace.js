/// <reference path="quantum.js" />
/// <reference path="quantum.circuit.js" />
/// <reference path="quantum.factoryshowroom.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Templates */

  function _workspaceTmpl() {
    return [
		  '<div class="q-workspace">',
		  '</div>'].join('');
  }


  /* Constructor */

  function Workspace(registerSize, gateConstructors) {
    var self = this;

    self.registerSize = registerSize;
    self.gateConstructors = gateConstructors;

    Q.UIElement.call(self, _workspaceTmpl);
  }


  /* Prototype Methods */

  Workspace.prototype = new Q.UIElement();

  Workspace.prototype.render = function render() {
    var self = this,
        registerSize = self.registerSize,
        gateConstructors = self.gateConstructors;

    self.element.empty();

    self.factoryShowroom = new Q.FactoryShowroom(gateConstructors);
    self.appendChild(self.element, self.factoryShowroom);

    self.circuit = new Q.Circuit(registerSize);
    self.appendChild(self.element, self.circuit);
  };


  /* Expose */

  Q.Workspace = Workspace;

}(this, this.Quantum, this.jQuery));
