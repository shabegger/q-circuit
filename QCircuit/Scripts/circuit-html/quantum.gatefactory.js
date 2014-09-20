/// <reference path="quantum.js" />
/// <reference path="quantum.gate.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Private Variables */

  var _styles = {
    padding: 25,
    width: 50,
    height: 50
  };

  var _rowClasses = [
    'q-mod-firstRow',
    'q-mod-secondRow'
  ];


  /* Templates */

  function _gateFactoryTmpl() {
    return [
		  '<div class="q-gateFactory">',
		  '</div>'].join('');
  }


  /* Constructor */

  function GateFactory(gateConstructor) {
    var self = this;

    self.gateConstructor = gateConstructor;

    Q.UIElement.call(self, _gateFactoryTmpl);
  }


  /* Prototype Methods */

  GateFactory.prototype = new Q.UIElement();

  GateFactory.prototype.render = function render() {
    var self = this,
        element = self.element,
        parent = element.parent(),
        padding, width, height,
        rowCount,
        index, left;

    element.empty();

    padding = _styles.padding;
    width = _styles.width + padding;
    height = _styles.height + padding;

    rowCount = Math.floor((parent.innerHeight() - padding) / height);

    index = element.index('.q-gateFactory');
    left = padding + (Math.floor(index / rowCount) * width);

    element
      .removeClass(_rowClasses.join(' '))
      .addClass(_rowClasses[index % _rowClasses.length])
      .css('left', left);
  };

  GateFactory.prototype.generateGate = function generateGate() {
    var self = this,
        gateConstructor = self.gateConstructor,
        gate = new gateConstructor();

    self.appendChild(self.element, gate);
  };


  /* Expose */

  Q.GateFactory = GateFactory;

}(this, this.Quantum, this.jQuery));
