/// <reference path="quantum.js" />
/// <reference path="quantum.slot.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Templates */

  function _circuitTmpl() {
    return [
		  '<div class="q-circuit">',
		  '</div>'].join('');
  }


  /* Constructor */

  function Circuit(slotCount) {
    var self = this;

    self.render(slotCount);
  }


  /* Prototype Methods */

  Circuit.prototype.render = function render(slotCount) {
    var self = this,
        i, slot;

    if (!self.element) {
      self.element = $(_circuitTmpl());
    }

    self.element.empty();

    for (i = 0; i < slotCount; i++) {
      slot = new Q.Slot();
      self.element.append(slot.element);
    }
  };


  /* Expose */

  Q.Circuit = Circuit;

}(this, this.Quantum, this.jQuery));
