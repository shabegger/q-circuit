/// <reference path="quantum.js" />
/// <reference path="quantum.workspace.js" />
/// <reference path="quantum.events.js" />
/// <reference path="quantum.gate.js" />
/// <reference path="quantum.gatefactory.js" />

; (function (window, Q, SVG, undefined) {

  'use strict';


  /* Scope Variables */

  var _padding = 25,
      _rows = 2,
      _gateSize = Q.Gate.SIZE,
      _gateAndPadding = _gateSize + _padding,
      _height = (_rows * _gateAndPadding) + _padding,
      _gradientSize = 10,
      _gradientFraction = _gradientSize / _height,
      _leftMask, _rightMask,
      _background;


  /* Constructor */

  function FactoryShowroom(workspace, gateConstructors) {
    var self = this;

    self.workspace = workspace;
    self.gateConstructors = gateConstructors || [];
    self.factories = [];

    Q.Events.mixinEvents(self);

    self.render();
  }


  /* Prototype Methods */

  FactoryShowroom.prototype.render = function render() {
    var self = this,
        workspace = self.workspace,
        gateConstructors = self.gateConstructors,
        factories = self.factories,
        svg = self.svg,
        container,
        factory,
        i, len,
        x, y;

    if (svg) {
      svg.remove();
    }

    while (factories.length) {
      factories.pop().removeEventListener('dragStart');
    }

    // Create opacity gradient masks for buttons
    _leftMask = _leftMask || workspace.svg.defs().rect().attr({
      x: 0,
      y: 0,
      width: 80,
      height: _height,
      fill: workspace.svg.gradient('radial', function (stop) {
        stop.at(0).attr({ class: 'quantum-scroll-btn-highlight' });
        stop.at(1, '#000');
      }).attr({
        fx: 0.65
      })
    });

    _rightMask = _rightMask || workspace.svg.defs().rect().attr({
      x: -80,
      y: 0,
      width: 80,
      height: _height,
      fill: workspace.svg.gradient('radial', function (stop) {
        stop.at(0).attr({ class: 'quantum-scroll-btn-highlight' });
        stop.at(1, '#000');
      }).attr({
        fx: 0.35
      })
    });

    // Create gradient fill
    _background = _background || workspace.svg.gradient('linear', function (stop) {
      stop.at(0, '#aaa');
      stop.at(_gradientFraction, '#ccc');
      stop.at(1 - _gradientFraction, '#ccc');
      stop.at(1, '#aaa');
    }).from(0, 0).to(0, 1);

    // Create container element for control
    svg = self.svg = workspace.svg.nested().attr({
      x: 0,
      y: 0,
      width: '100%',
      height: _height
    });

    // Create container for scrollable items
    container = self.container = svg.nested().attr({
      x: 0,
      y: 0,
      width: '100%',
      height: '100%'
    });

    container.rect('100%', '100%').fill(_background);

    // Create left scroller button
    self.left = svg.nested().maskWith(_leftMask).attr({
      x: 0,
      y: 0,
      width: 0,
      height: _height,
      class: 'quantum-scroll-btn'
    });

    self.left.rect().attr({
      x: 0,
      y: 0,
      width: 80,
      height: '100%',
      class: 'quantum-scroll-btn-background'
    });

    self.left.path('M 60 67.5 L 60 107.5 L 20 87.5 Z').attr({
      class: 'quantum-scroll-btn-arrow'
    });

    // Create right scroller button
    self.right = svg.nested().maskWith(_rightMask).attr({
      x: '100%',
      y: 0,
      width: 0,
      height: _height,
      class: 'quantum-scroll-btn'
    })

    self.right.rect().attr({
      x: -80,
      y: 0,
      width: 80,
      height: '100%',
      class: 'quantum-scroll-btn-background'
    });

    self.right.path('M -60 67.5 L -60 107.5 L -20 87.5 Z').attr({
      class: 'quantum-scroll-btn-arrow'
    });

    // Create factories
    for (i = 0, len = gateConstructors.length; i < len; i++) {
      x = (_gateAndPadding * Math.floor(i / _rows)) + _padding;
      y = (_gateAndPadding * (i % _rows)) + _padding;

      factory = new Q.GateFactory(workspace, gateConstructors[i], x, y, container);

      factory.addEventListener('dragStart', function (e) {
        dragStart.apply(self, arguments);
      });

      factories.push(factory);
    }
  };


  /* Event Handlers */

  function dragStart(e) {
    var self = this;

    self.dispatchEvent('dragStart', e);
  }


  /* Static Properties */

  FactoryShowroom.HEIGHT = _height;


  /* Expose */

  Q.FactoryShowroom = FactoryShowroom;

}(this, this.Quantum, this.SVG));