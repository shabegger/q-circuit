﻿/// <reference path="../common/guid.js" />
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


  /* Private Variables */

  var _constructors = {};


	/* Templates */

	function _gateTmpl() {
		return [
		  '<div class="q-gate">',
		  '</div>'].join('');
	}


	/* Constructor */

	function Gate() {
	  var self = this,
        vars = {};

	  M.Events.mixinEvents(self);

	  self.serialize = $.proxy(serialize, self, vars);
	  self.update = $.proxy(update, self, vars);

	  self.drag = $.proxy(drag, self, vars);
	  self.move = $.proxy(move, self, vars);
	  self.drop = $.proxy(drop, self, vars);
	  self.cancel = $.proxy(cancel, self, vars);
	  self.context = $.proxy(context, self, vars);

	  vars.items = [
      {
        title: 'Add Control Gate',
        callback: function () { alert('Hi!') }
      }
	  ];
    
    self.render();
	}


  /* Constructor Mixins */

	M.Events.mixinEvents(Gate);


  /* Prototype Methods */

	Gate.prototype.render = function render() {
	  var self = this;

	  if (!self.element) {
	    self.element = $(_gateTmpl())
        .append(self.getDisplayContent())
        .draggable({
	        drag: self.drag,
	        move: self.move,
	        drop: self.drop,
	        cancel: self.cancel,
          contextDelay: true
        })
	      .on('beforecontext', self.context);
	  }
	};

	Gate.prototype.getId = function getId() {
	  return Guid.Empty;
	};

	Gate.prototype.getDisplayContent = function getDisplayContent() {
	  return '';
	};


  /* Instance Methods */

	function serialize(vars) {
	  var self = this;

	  return {
	    Id: vars.id || Guid.Empty,
      GateId: self.getId()
	  };
	}

	function update(vars, gate) {
	  vars.id = gate.Id;
	}
  
  
  /* Event Handlers */

	function drag(vars, e) {
	  var self = this,
	      top = e.top,
        left = e.left,
        width = vars.width = vars.width || self.element.outerWidth(),
        height = vars.height = vars.height || self.element.outerHeight();

	  self.dispatchEvent('drag');
	  Gate.dispatchEvent('drag', {
	    gate: self,
	    top: top,
	    left: left,
	    height: height,
      width: width
	  });
	}

	function move(vars, e) {
	  var self = this,
	      top = e.top,
        left = e.left,
        width = vars.width = vars.width || self.element.outerWidth(),
        height = vars.height = vars.height || self.element.outerHeight();

	  self.dispatchEvent('move');
	  Gate.dispatchEvent('move', {
	    gate: self,
	    top: top,
	    left: left,
	    height: height,
	    width: width
	  });
	}

	function drop(vars, e) {
	  var self = this,
        element = self.element,
	      event;

	  event = {
      handled: false
	  }

	  self.dispatchEvent('drop', event);
	  Gate.dispatchEvent('drop', $.extend(event, {
	    gate: self
	  }));

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

	function cancel(vars, e) {
	  var self = this,
        element = self.element;

	  self.dispatchEvent('cancel', event);

	  element
      .draggable(false)
      .animate({
        'opacity': 0
      }, 200, function () {
        element.remove();
      });

	  e.preventDefault();
	}

	function context(vars, e) {
	  var self = this,
        menu = e.menu;

	  menu.setContextMenu(vars.items);
	}


  /* Dynamic Class Creation */

	Gate.fromSavedGate = function fromSavedGate(savedGate) {
	  var id = savedGate.Id;

	  if (_constructors[id]) {
	    return _constructors[id];
	  }

	  function constructor() {
	    Gate.call(this);
	  }

	  constructor.prototype = Object.create(Gate.prototype);

	  constructor.prototype.getId = function getId() {
	    return id;
	  };

	  constructor.prototype.getDisplayContent = function getDisplayContent() {
	    return savedGate.Display || '';
	  };

	  _constructors[id] = constructor;

	  return constructor;
	};

	Gate.get = function get(id) {
	  var constructor = _constructors[id];

	  return (constructor && new constructor()) || null;
	};


	/* Expose */

	Q.Gate = Gate;

}(this, this.Quantum, this.Mixins, this.jQuery));
