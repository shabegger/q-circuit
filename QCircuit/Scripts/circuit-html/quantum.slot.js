/// <reference path="quantum.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Templates */

  function _slotTmpl() {
    return [
		  '<div class="q-slot">',
        '<div class="q-slot-background"></div>',
		  '</div>'].join('');
  }


  /* Constructor */

  function Slot() {
    var self = this;

    self.render();
  }


  /* Prototype Methods */

  Slot.prototype.render = function render() {
    var self = this;

    if (!self.element) {
      self.element = $(_slotTmpl());
    }

    self.element.find(':not(".q-slot-background")').remove();
  };


  /* Expose */

  Q.Slot = Slot;

}(this, this.Quantum, this.jQuery));
