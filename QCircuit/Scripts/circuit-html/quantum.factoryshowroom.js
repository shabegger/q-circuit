/// <reference path="quantum.js" />
/// <reference path="quantum.gatefactory.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Templates */

  function _factoryShowroomTmpl() {
    return [
      '<div class="q-factoryShowroom">',
        '<div class="q-factoryShowroom-content">',
        '</div>',
      '</div>'].join('');
  }


  /* Constructor */

  function FactoryShowroom(gateConstructors) {
    var self = this;

    self.gateConstructors = gateConstructors || [];
    self.factories = [];

    Q.UIElement.call(self, _factoryShowroomTmpl);
  }


  /* Prototype Methods */

  FactoryShowroom.prototype = new Q.UIElement();

  FactoryShowroom.prototype.render = function render() {
    var self = this,
        gateConstructors = self.gateConstructors,
        factories = self.factories,
        factory,
        content,
        i, len;

    content = self.element.find('.q-factoryShowroom-content');
    content.empty();

    // Remove old factories
    while (factories.length) {
      factories.pop();
    }

    // Create new factories
    for (i = 0, len = gateConstructors.length; i < len; i++) {
      factory = new Q.GateFactory(gateConstructors[i]);
      factories.push(factory);
      self.appendChild(content, factory);
      factory.generateGate();
    }
  };


  /* Expose */

  Q.FactoryShowroom = FactoryShowroom;

}(this, this.Quantum, this.jQuery));
