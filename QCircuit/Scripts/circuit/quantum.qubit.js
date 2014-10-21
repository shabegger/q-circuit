/// <reference path="quantum.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Templates */

  function _qubitTmpl() {
    return [
		  '<div class="q-qubit">',
        '<svg></svg>',
		  '</div>'].join('');
  }


  /* Constructor */

  function Qubit() {
    var self = this;

    self.render();
  }


  /* Prototype Methods */

  Qubit.prototype.render = function render() {
    var self = this;

    if (!self.element) {
      self.element = $(_qubitTmpl());
    }

    self.element.empty();
  };


  /* Expose */

  Q.Qubit = Qubit;

}(this, this.Quantum, this.jQuery));
