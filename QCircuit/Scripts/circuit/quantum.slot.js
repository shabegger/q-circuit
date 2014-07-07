/// <reference path="quantum.js" />
/// <reference path="quantum.workspace.js" />

; (function (window, Q, SVG, undefined) {

  'use strict';


  /* Scope Variables */

  var _padding = 15,
      _size = 60,
      _size_1_2x = _size / 2,
      _sizeAndPadding = _size + _padding,
      _gradientSize = 10,
      _gradientFraction = _gradientSize / _size,
      _background,
      _background_radial,
      _filter;


  /* Constructor */
  
  function Slot(circuit, position) {
    var self = this;

    self.position = position;

    self.render(circuit);
  }


  /* Prototype Methods */

  Slot.prototype.render = function render(circuit) {
    var self = this,
        position = self.position,
        svg = self.svg,
        mask,
        leftCap, rightCap;

    if (svg) {
      svg.remove();
    }

    svg = self.svg = circuit.svg.nested().attr({
      x: 0,
      y: (position * _sizeAndPadding) + _padding,
      width: '100%',
      height: _size
    });

    // Create gradient fill
    _background = _background || circuit.workspace.svg.gradient('linear', function (stop) {
      stop.at(0, '#aaa');
      stop.at(_gradientFraction, '#ccc');
      stop.at(1 - _gradientFraction, '#ccc');
      stop.at(1, '#aaa');
    }).from(0, 0).to(0, 1);

    _background_radial = _background_radial || circuit.workspace.svg.gradient('radial', function (stop) {
      stop.at(1 - (2 * _gradientFraction), '#ccc');
      stop.at(1, '#aaa');
    });

    // Create end cap mask
    mask = circuit.workspace.svg.defs().group().attr({
      width: '100%',
      height: _size
    });

    mask.rect('100%', '100%').fill('#fff');

    mask.nested().attr({
      x: 0
    }).rect(_padding + _size_1_2x, _size).fill('#000');

    mask.nested().attr({
      x: '100%'
    }).rect(_padding + _size_1_2x, _size).fill('#000').attr({
      x: 0 - (_padding + _size_1_2x)
    });

    // Create background
    svg.rect('100%', '100%').fill(_background).maskWith(mask);

    leftCap = svg.nested().attr({
      x: 0
    });

    rightCap = svg.nested().attr({
      x: '100%'
    });

    leftCap.circle(_size).fill(_background_radial).attr({
      cx: _padding + _size_1_2x,
      cy: _size_1_2x
    }).clipWith(leftCap.rect(_padding + _size_1_2x, _size));

    rightCap.circle(_size).fill(_background_radial).attr({
      cx: 0 - (_padding + _size_1_2x),
      cy: _size_1_2x
    }).clipWith(rightCap.rect(_padding + _size_1_2x, _size).attr({
      x: 0 - (_padding + _size_1_2x)
    }));
  };

  Slot.prototype.gateMoved = function gateMoved(gate, checkHit) {
    var self = this,
        svg = self.svg;

    if (checkHit && acceptGateOver.call(self, gate)) {
      if (svg.filterer) {
        return true;
      }

      if (_filter) {
        svg.filter(_filter);
      } else {
        svg.filter(function (filter) {
          filter.glow();
        });

        _filter = svg.filterer;
      }
      
      return true;
    }

    svg.unfilter();
    return false;
  };

  Slot.prototype.tryAcceptGate = function tryAcceptGate(gate, attr) {
    var self = this,
        svg = self.svg,
        loc, x,
        gateLoc, gateX,
        offset,
        minX, maxX;

    if (acceptGateOver.call(self, gate)) {
      loc = svg.loc();
      x = loc.x;
      gateLoc = gate.svg.loc();
      gateX = gateLoc.x;
      offset = (loc.height - gateLoc.height) / 2;

      attr.y = loc.y + offset;

      minX = x + _padding + offset;
      if (gateX < minX) {
        attr.x = minX;
      }

      maxX = x + loc.width - _padding - offset - gateLoc.width;
      if (gateX > maxX) {
        attr.x = maxX;
      }

      svg.unfilter();
      return true;
    }

    return false;
  };


  /* Helpers */

  function acceptGateOver(gate) {
    var self = this,
        loc = self.svg.loc(),
        x = loc.x,
        y = loc.y,
        x1 = x + _padding,
        y1 = y,
        x2 = x + loc.width - _padding,
        y2 = y + loc.height,
        gateLoc = gate.svg.loc(),
        centerX = gateLoc.x + (gateLoc.width / 2),
        centerY = gateLoc.y + (gateLoc.height / 2);

    return centerX > x1 && centerX < x2 && centerY > y1 && centerY < y2;
  }


  /* Expose */

  Q.Slot = Slot;

}(this, this.Quantum, this.SVG));