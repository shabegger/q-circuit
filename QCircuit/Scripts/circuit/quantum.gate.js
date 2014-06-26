/// <reference path="quantum.js" />
/// <reference path="quantum.workspace.js" />
/// <reference path="quantum.events.js" />

; (function (window, Q, SVG, undefined) {

  'use strict';


  /* Scope Variables */

  var _filter,
      _size = 50,
      _size_1_2x = _size / 2,
      _time = Q.AnimationIntervals.SHORT;


  /* Constructor */

  // parent is optional
  function Gate(workspace, x, y, parent) {
    var self = this;

    self.workspace = workspace;
    self.parent = parent || null;

    Q.Events.mixinEvents(self);

    self.render(x, y);
    self.setupDrag();
  }


  /* Prototype Methods */

  Gate.prototype.render = function render(x, y) {
    var self = this,
        workspace = self.workspace,
        parent = self.parent || workspace.svg,
        svg = self.svg;

    if (svg) {
      svg.remove();
    }

    svg = self.svg = parent.nested().attr({
      x: x || 0,
      y: y || 0,
      width: _size,
      height: _size,
      class: 'quantum-gate'
    });

    svg.rect('100%', '100%').attr({
      rx: _size_1_2x,
      ry: _size_1_2x
    });

    svg.nested().attr({
      x: '50%',
      y: '50%'
    }).plain('H').center(0, 0);

    if (_filter) {
      svg.filter(_filter);
    } else {
      svg.filter(function (filter) {
        filter.bevel();
      });

      _filter = svg.filterer;
    }
  };

  Gate.prototype.setupDrag = function setupDrag() {
    var self = this,
        svg = self.svg;

    svg.draggable();

    svg.dragstart = function () {
      dragStart.apply(self, arguments);
    };

    svg.dragend = function () {
      dragEnd.apply(self, arguments);
    };
  };


  /* Event Handlers */

  function dragStart(e) {
    var self = this,
        svg = self.svg,
        event;

    event = {
      finalAttributes: {}
    };

    self.dispatchEvent('dragStart', event);

    svg.front().animate(_time).attr(event.finalAttributes);
  }

  function dragEnd(e) {
    var self = this,
        svg = self.svg,
        event;

    event = {
      accepted: false,
      finalAttributes: {}
    };

    self.dispatchEvent('dragEnd', event);

    svg.animate(_time).attr(event.finalAttributes);
  }


  /* Static Properties */

  Gate.SIZE = _size;


  /* Expose */

  Q.Gate = Gate;

}(this, this.Quantum, this.SVG));