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

  function Workspace() {
    var self = this;

    self.render();
  }


  /* Prototype Methods */

  Workspace.prototype.render = function render() {
    var self = this;

    if (!self.element) {
      self.element = $(_workspaceTmpl());
    }

    self.element.empty();

    self.factoryShowroom = new Q.FactoryShowroom([]);
    self.element.append(self.factoryShowroom.element);

    self.circuit = new Q.Circuit(5);
    self.element.append(self.circuit.element);
  };


  /* Expose */

  Q.Workspace = Workspace;

}(this, this.Quantum, this.jQuery));
