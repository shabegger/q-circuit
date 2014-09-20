/// <reference path="quantum.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

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

    self.render();
	}


	/* Prototype Methods */

	Gate.prototype.render = function render() {
	  var self = this;

	  if (!self.element) {
	    self.element = $(_gateFactoryTmpl());
	  }
	};


	/* Expose */

	Q.Gate = Gate;

}(this, this.Quantum, this.jQuery));
