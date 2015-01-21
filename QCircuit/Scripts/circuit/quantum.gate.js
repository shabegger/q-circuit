/// <reference path="../common/guid.js" />
/// <reference path="../interaction/interaction.js" />
/// <reference path="../interaction/interaction.intersect.js" />
/// <reference path="../interaction/interaction.touch.js" />
/// <reference path="../interaction/interaction.drag.js" />
/// <reference path="../mixins/mixins.js" />
/// <reference path="../mixins/mixins.events.js" />
/// <reference path="quantum.js" />
/// <reference path="quantum.circuit.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, M, $, undefined) {

  'use strict';


  /* Private Variables */

  var _constructors = {},
      _class = 'q-gate',
      _classAdd = 'q-mod-add';


  /* Enums */

  var PART_TYPE = {
    MAIN: 0,
    CONTROL: 2
  };


	/* Templates */

  function _gateTmpl(type) {
    var className = null,
        adding = false;

    switch (type) {
      case PART_TYPE.CONTROL:
        className = 'q-gate-control';
        adding = true;
        break;
    };

		return [
		  '<div class="', _class,
        className ? ' ' + className : '',
        adding ? ' ' + _classAdd : '', '">',
		  '</div>'].join('');
  }

  function _connectorTmpl() {
    return '<div class="q-gate-connector"></div>';
  }


	/* Constructor */

	function Gate() {
	  var self = this,
        vars = {};

	  M.Events.mixinEvents(self);

	  self.serialize = $.proxy(serialize, self, vars);
	  self.update = $.proxy(update, self, vars);

	  self.width = $.proxy(width, self, vars);
	  self.height = $.proxy(height, self, vars);

	  self.drag = $.proxy(drag, self, vars);
	  self.move = $.proxy(move, self, vars);
	  self.drop = $.proxy(drop, self, vars);
	  self.cancel = $.proxy(cancel, self, vars);
	  self.context = $.proxy(context, self, vars);

	  vars.items = [
      {
        title: 'Add Control Bit',
        callback: $.proxy(addControl, self, vars)
      },
      {
        title: 'Remove All Control Bits',
        callback: $.proxy(removeAllControls, self, vars)
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
	    self.element = $(_gateTmpl(PART_TYPE.MAIN))
        .append(self.getDisplayContent())
        .draggable({
	        drag: self.drag,
	        move: self.move,
	        drop: self.drop,
	        cancel: self.cancel,
          contextDelay: true
        });
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

	function width(vars) {
	  var self = this;

	  return vars.width = vars.width || self.element.outerWidth();
	}

	function height(vars) {
	  var self = this;

	  return vars.height = vars.height || self.element.outerHeight();
	}
  
  
  /* Event Handlers */

	function drag(vars, e) {
	  var self = this,
        element = self.element,
	      top = e.top,
        left = e.left,
        width = vars.width = vars.width || element.outerWidth(),
        height = vars.height = vars.height || element.outerHeight();

	  element.off('beforecontext');
	  removeAddParts();

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

	  if (event.slot) {
	    vars.parts = [
        {
          element: self.element,
          part: PART_TYPE.MAIN,
          slot: event.slot
        }
	    ];

	    element
	      .on('beforecontext', self.context)
	  } else {
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

	function removeAllControls(vars, e) {
	  var self = this;

	  vars.connector && vars.connector.remove();
	  vars.connector = null;

	  vars.parts = $.grep(vars.parts, function (part) {
	    if (part.part === PART_TYPE.CONTROL) {
	      part.element.remove();
	      return false;
	    }

	    return true;
	  })

	  self.element
      .draggable({
        drag: self.drag,
        move: self.move,
        drop: self.drop,
        cancel: self.cancel,
        contextDelay: true
      });
	}

	function removeControl() {

	}

	function addControl(vars, e) {
	  var self = this,
	      circuit = Q.Circuit(),
	      slots = circuit.slots(),
        parts = vars.parts,
	      i, len, slot,
        left = self.element.get(0).style.left,
        slotParts,
	      gatePart, element,
        partsAdded = false;

	  for (i = 0, len = slots.length; i < len; i++) {
	    slot = slots[i];
	    slotParts = $.grep(parts, function (part) {
	      return part.slot === slot;
	    });

	    if (slotParts.length === 0) {
	      element = $(_gateTmpl(PART_TYPE.CONTROL))
	        .css('left', left);

	      gatePart = {
	        element: element,
	        part: PART_TYPE.CONTROL,
	        slot: slot
	      }

	      slot.append(element);
	      partsAdded = true;

	      element.on('click', $.proxy(finalizeAddPart, self, {
	        vars: vars,
	        gatePart: gatePart
	      }));
	    }
	  }

	  if (partsAdded) {
	    $(window.document).on('click', removeAddParts);
	  }
	}

	function removeAddParts() {
	  $(['.', _class, '.', _classAdd].join('')).remove();
	  $(window.document).off('click', removeAddParts);
	}

	function finalizeAddPart(options, e) {
	  var self = this,
        gatePart = options.gatePart,
        vars = options.vars,
        element = gatePart.element,
        left = element.get(0).style.left,
	      parts = vars.parts,
        connector, part,
        y, minY, maxY,
        minPart, maxPart,
        i, len;

	  $.each(parts, function (index, part) {
	    if (part.part === PART_TYPE.MAIN) {
	      part.element.draggable(false);
	      return false;
	    }
	  });

	  parts.push(gatePart);
	  gatePart.slot.add();

	  element.off('click')
      .removeClass(_classAdd);

	  if (!vars.connector) {
	    vars.connector = $(_connectorTmpl());
	  }

	  connector = vars.connector;

	  part = parts[0];
	  y = part.element.offset().top;
	  minY = maxY = y;
	  minPart = maxPart = part;

	  for (i = 1, len = parts.length; i < len; i++) {
	    part = parts[i];
	    y = part.element.offset().top;

	    if (y < minY) {
	      minY = y;
	      minPart = part;
	    } else if (y > maxY) {
	      maxY = y;
	      maxPart = part;
	    }
	  }

	  connector.remove().css({
	    'left': left,
      'height': maxY - minY
	  });

	  minPart.slot.append(connector);
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
