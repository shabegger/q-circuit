/// <reference path="../interaction/interaction.js" />
/// <reference path="../interaction/interaction.intersect.js" />
/// <reference path="quantum.js" />
/// <reference path="quantum.gate.js" />
/// <reference path="quantum.slot.js" />
/// <reference path="quantum.workspace.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Private Variables */

  var _circuit = null,
      _classModHover = 'q-mod-hover',
      _slotLeft = 0,
      _slotRight = 0,
      _slotTop,
      _slotBottom;


  /* Templates */

  function _circuitTmpl() {
    return [
		  '<div class="q-circuit">',
		  '</div>'].join('');
  }


  /* Constructor */

  function Circuit(slotCount) {
    var self = this;

    //Q.Workspace.addEventListener('ready', workspaceReady);
    //Q.Gate.addEventListener('drag', gateDragged);
    //Q.Gate.addEventListener('move', gateDragged);
    //Q.Gate.addEventListener('drop', gateDropped);

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


  /* Singleton Methods */

  function getInstance(slotCount) {
    if (_circuit === null) {
      _circuit = new Circuit(slotCount);
    }

    return _circuit;
  }


  /* Event Handlers */

  function workspaceReady(e) {
    var slots = _circuit.element.children(),
        i, len,
        slot,
        bounds;

    _slotTop = [];
    _slotBottom = [];

    for (i = 0, len = slots.length; i < len; i++) {
      slot = slots[i];
      bounds = slot.bounds();

      if (i === 0) {
        _slotLeft = bounds.left;
        _slotRight = bounds.right;
      }

      _slotTop.push(bounds.top);
      _slotBottom.push(bounds.bottom);
    }
  }

  function gateDragged(e) {
    var x = e.centerX,
        y = e.centerY;
  }

  function gateDropped(e) {
    _circuit.element.children().removeClass(_classModHover);
  }


  /* Expose */

  Q.Circuit = Circuit;//{
  //  get: getInstance
  //};

}(this, this.Quantum, this.jQuery));
