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

  function FactoryShowroom() {
    var self = this,
        vars = {};

    self.factories = [];

    self.calculateScrollMax = $.proxy(calculateScrollMax, self, vars);
    self.updateScrollButtons = $.proxy(updateScrollButtons, self, vars);

    self.render();
  }


  /* Prototype Methods */

  FactoryShowroom.prototype.render = function render() {
    var self = this,
        factories = self.factories;

    if (!self.element) {
      self.element = $(_factoryShowroomTmpl());
    }
    
    // Remove old factories
    self.element.find(['.', _classContent].join('')).empty();
    while (factories.length) {
      factories.pop();
    }

    self.element.find(['.', _classScroller].join(''))
      .scrollable({
        left: self.element.find(['.', _classLeft].join('')),
        right: self.element.find(['.', _classRight].join(''))
      })
      .on('scroll', self.updateScrollButtons);

    self.calculateScrollMax();
    $(window).on('resize', self.calculateScrollMax);
  };

  FactoryShowroom.prototype.addGates = function addGates(gateConstructors) {
    var self = this,
        factories = self.factories,
        content = self.element.find(['.', _classContent].join('')),
        gateConstructor,
        factory,
        i, len;

    if (!$.isArray(gateConstructors)) {
      gateConstructors = [gateConstructors];
    }

    for (i = 0, len = gateConstructors.length; i < len; i++) {
      gateConstructor = gateConstructors[i];

      if ($.isFunction(gateConstructor)) {
        factory = new Q.GateFactory(gateConstructor);
        factories.push(factory);
        content.append(factory.element);
      }
    }

    self.calculateScrollMax();
  };


  /* Instance Methods */

  function calculateScrollMax(vars) {
    var self = this,
        scrollerWidth,
        scrolleeWidth;

    scrollerWidth =
      self.element.find(['.', _classScroller].join('')).innerWidth();
    scrolleeWidth =
      self.element.find(['.', _classContent].join('')).outerWidth();

    vars.scrollMax = Math.max(0, scrolleeWidth - scrollerWidth);
    self.updateScrollButtons();
  }

  function updateScrollButtons(vars) {
    var self = this,
        scrollValue;

    scrollValue =
      self.element.find(['.', _classScroller].join('')).scrollLeft();

    if (scrollValue === 0) {
      self.element.find(['.', _classLeft].join('')).hide();
    } else {
      self.element.find(['.', _classLeft].join('')).show();
    }

    if (scrollValue >= vars.scrollMax) {
      self.element.find(['.', _classRight].join('')).hide();
    } else {
      self.element.find(['.', _classRight].join('')).show();
    }
  }


  /* Expose */

  Q.FactoryShowroom = FactoryShowroom;

}(this, this.Quantum, this.jQuery));
