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

  function GateFactory() {
    var self = this;
  }


  /* Prototype Methods */

  GateFactory.prototype.render = function render() {
    var self = this;
  };


  /* Expose */

  Q.GateFactory = GateFactory;

}(this, this.Quantum, this.jQuery));
