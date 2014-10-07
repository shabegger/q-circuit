/// <reference path="../interaction/interaction.js" />
/// <reference path="../interaction/interaction.intersect.js" />
/// <reference path="../interaction/interaction.touch.js" />
/// <reference path="../interaction/interaction.drag.js" />
/// <reference path="../mixins/mixins.js" />
/// <reference path="../mixins/mixins.events.js" />s
/// <reference path="quantum.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, M, $, undefined) {

	'use strict';


	/* Templates */

	function _gateTmpl() {
		return [
		  '<div class="q-gate">',
		  '</div>'].join('');
	}


	/* Constructor */

	function Gate() {
	  var self = this;

	  M.Events.mixinEvents(self);

	  self.drag = $.proxy(drag, self);
	  self.move = $.proxy(move, self);
	  self.drop = $.proxy(drop, self);
    
    self.render();
	}


  /* Constructor Mixins */

	M.Events.mixinEvents(Gate);


	/* Prototype Methods */

	Gate.prototype.render = function render() {
	  var self = this;

	  if (!self.element) {
	    self.element = $(_gateTmpl()).draggable({
	      drag: self.drag,
	      move: self.move,
	      drop: self.drop
	    });
	  }
	};
  
  
  /* Event Handlers */

	function drag(e) {
	  var self = this,
	      top = e.top,
        left = e.left,
        w = self._w = self._w || self.element.outerWidth() / 2,
        h = self._h = self._h || self.element.outerHeight() / 2;

	  self.dispatchEvent('drag');
	  Gate.dispatchEvent('drag', {
	    gate: self,
	    centerX: left + w,
      centerY: top + h
	  });
	}

	function move(e) {
	  var self = this,
	      top = e.top,
        left = e.left,
        width = self.element.outerWidth(),
        height = self.element.outerHeight();

	  self.dispatchEvent('move');
	  Gate.dispatchEvent('move', {
	    gate: self,
	    centerX: left + (width / 2),
	    centerY: top + (height / 2)
	  });
	}

	function drop() {
	  var self = this,
        element = self.element,
	      event;

	  event = {
      handled: false
	  }

	  self.dispatchEvent('drop', event);
	  Gate.dispatchEvent('drop', event);

	  if (!event.handled) {
	    element
        .draggable(false)
        .animate({
          'opacity': 0
	      }, 200, function () {
	        element.remove();
	      });
	  }
	}


	/* Expose */

	Q.Gate = Gate;

}(this, this.Quantum, this.Mixins, this.jQuery));
