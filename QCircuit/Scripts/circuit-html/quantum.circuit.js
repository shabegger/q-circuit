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

    self.slotCount = slotCount;

    Q.UIElement.call(self, _circuitTmpl);
  }


  /* Prototype Methods */

  Circuit.prototype = new Q.UIElement();

  Circuit.prototype.render = function render() {
    var self = this,
        slotCount = self.slotCount,
        i, slot;

    self.element.empty();

    for (i = 0; i < slotCount; i++) {
      slot = new Q.Slot();
      self.appendChild(self.element, slot);
    }
  };


  /* Expose */

  Q.Circuit = Circuit;

}(this, this.Quantum, this.jQuery));
