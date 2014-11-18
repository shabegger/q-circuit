/// <reference path="../interaction/interaction.scroll.js" />
/// <reference path="quantum.js" />
/// <reference path="quantum.gatefactory.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Private Variables */

  var _classLeft = 'q-factoryShowroom-left',
      _classRight = 'q-factoryShowroom-right',
      _classScroller = 'q-factoryShowroom-scroller',
      _classContent = 'q-factoryShowroom-content';


  /* Templates */

  function _factoryShowroomTmpl() {
    return [
      '<div class="q-factoryShowroom">',
        '<div class="', _classScroller, '">',
          '<div class="', _classContent, '"></div>',
        '</div>',
        '<a class="', _classLeft, '"></a>',
        '<a class="', _classRight, '"></a>',
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

    content = self.element.find(['.', _classContent].join(''));
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

    self.element.find(['.', _classScroller].join('')).scrollable({
      left: self.element.find(['.', _classLeft].join('')),
      right: self.element.find(['.', _classRight].join(''))
    });
  };


  /* Expose */

  Q.FactoryShowroom = FactoryShowroom;

}(this, this.Quantum, this.jQuery));
