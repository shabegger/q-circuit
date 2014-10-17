/// <reference path="../mixins/mixins.js" />
/// <reference path="../mixins/mixins.events.js" />s
/// <reference path="quantum.js" />
/// <reference path="quantum.circuit.js" />
/// <reference path="quantum.factoryshowroom.js" />
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

  function Workspace() {
    var self = this;

    self.render();
  }


  /* Constructor Mixins */

  M.Events.mixinEvents(Workspace);


  /* Prototype Methods */

  Workspace.prototype.render = function render() {
    var self = this;

    if (!self.element) {
      self.element = $(_workspaceTmpl());
    }

    self.element.empty();

    self.factoryShowroom = new Q.FactoryShowroom([Q.Gate, Q.Gate, Q.Gate, Q.Gate, Q.Gate]);
    self.element.append(self.factoryShowroom.element);

    self.circuit = new Q.Circuit(5);
    self.element.append(self.circuit.element);

    Workspace.dispatchEvent('ready');
  };


  /* Expose */

  Q.Workspace = Workspace;

}(this, this.Quantum, this.Mixins, this.jQuery));
