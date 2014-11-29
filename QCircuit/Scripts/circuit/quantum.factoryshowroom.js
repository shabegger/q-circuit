/// <reference path="../bugfix/bugfix.js" />
/// <reference path="../bugfix/bugfix.flex.js" />
/// <reference path="../interaction/interaction.js" />
/// <reference path="../interaction/interaction.scroll.js" />
/// <reference path="../utility/utility.js" />
/// <reference path="../utility/utility.fn.js" />
/// <reference path="quantum.js" />
/// <reference path="quantum.gate.js" />
/// <reference path="quantum.gatefactory.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, U, B, $, undefined) {

  'use strict';


  /* Private Variables */

  var _class = 'q-factoryShowroom',
      _classLeft = 'q-factoryShowroom-left',
      _classRight = 'q-factoryShowroom-right',
      _classScroller = 'q-factoryShowroom-scroller',
      _classContent = 'q-factoryShowroom-content',
      _classPrefixSize = 'q-mod-size-';

  var _regexPrefixSize = /\bq-mod-size-(\d+)\b/,
      _minPrefixSize = 2,
      _maxPrefixSize = 5;


  /* Templates */

  function _factoryShowroomTmpl() {
    return [
      '<div class="', _class, '">',
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

    self.factoryHeight = U.Fn.once($.proxy(factoryHeight, self), true);
    self.factoryWidth = U.Fn.once($.proxy(factoryWidth, self), true);
    self.factoryMarginHeight =
      U.Fn.once($.proxy(factoryMarginHeight, self), true);
    self.factoryMarginWidth =
      U.Fn.once($.proxy(factoryMarginWidth, self), true);

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

  FactoryShowroom.prototype.canResize = function canResize() {
    var self = this,
        element = self.element,
        content;

    content = element.find(['.', _classContent].join(''));
    return B.Flex.isFlexContainer(content);
  };

  FactoryShowroom.prototype.size = function size(newSize) {
    var self = this,
        element = self.element,
        className, match,
        size;

    className = element.attr('class');
    match = _regexPrefixSize.exec(className);

    if (match && match.length > 1) {
      size = parseInt(match[1], 10);
    } else {
      size = 1;
    }

    if (isNaN(newSize)) {
      return size;
    }

    newSize = Math.round(newSize);
    newSize = Math.min(_maxPrefixSize, newSize);

    if (size !== newSize) {
      if (!self.canResize()) {
        return 1;
      }

      element.removeClass();
      element.addClass(_class);

      if (newSize >= _minPrefixSize) {
        element.addClass([_classPrefixSize, newSize].join(''));
      }

      self.calculateScrollMax();
    }

    return newSize;
  };

  FactoryShowroom.prototype.desiredWidth = function desiredWidth() {
    var self = this,
        count = self.factories.length;

    return (self.factoryWidth() * count) +
      (self.factoryMarginWidth() * (count + 1));
  };

  FactoryShowroom.prototype.actualWidth = function actualWidth() {
    var self = this,
        element = self.element;

    return element.innerWidth();
  };

  FactoryShowroom.prototype.heightForSize = function heightForSize(size) {
    var self = this;

    return (self.factoryHeight() * size) +
      (self.factoryMarginHeight() * (size + 1));
  };

  FactoryShowroom.prototype.sizeForHeight = function sizeForHeight(height) {
    var self = this;

    return Math.floor((height - self.factoryMarginHeight()) /
      (self.factoryHeight() + self.factoryMarginHeight()));
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

  function factoryHeight() {
    var self = this,
        element = self.element,
        factory;

    factory = element.find(['.', _classContent].join('')).children().first();
    return factory.outerHeight(false);
  }

  function factoryWidth() {
    var self = this,
        element = self.element,
        factory;

    factory = element.find(['.', _classContent].join('')).children().first();
    return factory.outerWidth(false);
  }

  function factoryMarginHeight() {
    var self = this,
        element = self.element,
        factory;

    factory = element.find(['.', _classContent].join('')).children().first();
    return factory.outerHeight(true) - self.factoryHeight();
  }

  function factoryMarginWidth() {
    var self = this,
        element = self.element,
        factory;

    factory = element.find(['.', _classContent].join('')).children().first();
    return factory.outerWidth(true) - self.factoryWidth();
  }


  /* Expose */

  Q.FactoryShowroom = FactoryShowroom;

}(this, this.Quantum, this.Utility, this.Bugfix, this.jQuery));
