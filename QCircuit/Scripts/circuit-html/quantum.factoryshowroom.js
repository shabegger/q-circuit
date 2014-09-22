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

    self.render();
  }


  /* Prototype Methods */

  FactoryShowroom.prototype.render = function render() {
    var self = this,
        gateConstructors = self.gateConstructors,
        factories = self.factories,
        factory,
        content,
        i, len;

    if (!self.element) {
      self.element = $(_factoryShowroomTmpl());
    }

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
      content.append(factory.element);
      factory.position();
    }
  };


  /* Expose */

  Q.FactoryShowroom = FactoryShowroom;

}(this, this.Quantum, this.jQuery));
