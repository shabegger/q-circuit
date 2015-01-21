/// <reference path="quantum.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Private Variables */

  var _classGateMod = 'q-gatemod';


  /* Templates */

  function _connectorTmpl() {
    return [
		  '<div class="q-gatemod-connector">',
		  '</div>'].join('');
  }


  /* Constructor */

  function GateMod(gate, template, x, y) {
    var self = this,
        vars;

    vars = {
      gate: gate
    };

    self.render = $.proxy(render, self, vars);

    self.render(template, x, y);
  }


  /* Instance Methods */

  function render(vars, template, x, y) {
    var self = this,
        gate = vars.gate,
        gateElement = gate.element,
        gateOffset,
        element,
        connector,
        w, h,
        gateY, gateX;

    if (!self.element) {
      element = self.element = $(template)
        .addClass(_classGateMod)
        .css({
          'position': 'absolute',
          'top': '100%',
          'left': '100%'
        })
        .appendTo('body');

      w = vars.width = element.outerWidth();
      h = vars.height = element.outerHeight();

      element
        .css({
          'top': y - (h / 2),
          'left': x - (w / 2)
        })
        .draggable({
          drag: null,
          move: $.proxy(move, self, vars),
          drop: null,
          cancel: null,
          constrain: 'y'
        });

      gateOffset = gateElement.offset();
      gateY = gateOffset.top + (gate.height() / 2);
      gateX = gateOffset.left + (gate.width() / 2);

      vars.gateY = top;

      connector = vars.connector = $(_connectorTmpl()).appendTo('body')
        .css({
          'position': 'absolute',
          'top': gateY,
          'left': gateX,
          'height': y - gateY
        });
    }
  }


  /* Event Handlers */

  function move(vars, e) {
    vars.connector
      .css({
        'height': e.y - vars.gateY
      });
  }


  /* Expose */

  Q.GateMod = GateMod;

}(this, this.Quantum, this.jQuery));
