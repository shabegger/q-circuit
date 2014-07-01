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
      _background_radial;


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

    // Create background
    svg.rect('100%', '100%').fill(_background);

    leftCap = svg.nested().attr({
      x: 0
    });

    rightCap = svg.nested().attr({
      x: '100%'
    });

    leftCap.rect(_padding + _size_1_2x, _size).fill('#fff');
    rightCap.rect(_padding + _size_1_2x, _size).fill('#fff').attr({
      x: 0 - (_padding + _size_1_2x)
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

  Slot.prototype.tryAcceptGate = function tryAcceptGate(gate, attr) {
    var self = this,
        loc = self.svg.loc(),
        x1 = loc.x + _padding,
        y1 = loc.y,
        x2 = loc.x + loc.width - _padding,
        y2 = loc.y + loc.height,
        gateLoc = gate.svg.loc(),
        gateX = gateLoc.x,
        gateWidth = gateLoc.width,
        centerX = gateLoc.x + (gateLoc.width / 2),
        centerY = gateLoc.y + (gateLoc.height / 2),
        offset,
        minX, maxX;

    if (centerX > x1 && centerX < x2 && centerY > y1 && centerY < y2) {
      offset = (loc.height - gateLoc.height) / 2;

      attr.y = y1 + offset;

      minX = x1 + offset;
      if (gateX < minX) {
        attr.x = minX;
      }

      maxX = x2 - offset - gateWidth;
      if (gateX > maxX) {
        attr.x = maxX;
      }

      return true;
    }

    return false;
  };


  /* Expose */

  Q.Slot = Slot;

}(this, this.Quantum, this.SVG));