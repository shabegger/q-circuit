/// <reference path="../mixins/mixins.js" />
/// <reference path="../mixins/mixins.events.js" />
/// <reference path="quantum.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, M, $, undefined) {

  'use strict';


  /* Private Variables */

  var _attrAction = 'data-action',
      _classTool = 'q-toolbar-tool';


  /* Templates */

  function _toolbarTmpl() {
    return [
      '<div class="q-toolbar">',
        '<a class="', _classTool, ' q-toolbar-new" data-name="New" ',
           _attrAction, '="new" title="Create a new algorithm"></a>',
        '<a class="', _classTool, ' q-toolbar-open" data-name="Open" ',
           _attrAction, '="open" title="Open an existing algorithm"></a>',
        '<a class="', _classTool, ' q-toolbar-copy" data-name="Copy" ',
           _attrAction, '="copy" title="Save a copy of the current algorithm"></a>',
        '<a class="', _classTool, ' q-toolbar-save" data-name="Save" ',
           _attrAction, '="save" title="Save the current algorithm"></a>',
        '<a class="', _classTool, ' q-toolbar-delete" data-name="Delete" ',
           _attrAction, 'n="delete" title="Delete the current algorithm"></a>',
        '<a class="', _classTool, ' q-toolbar-execute" data-name="Execute" ',
           _attrAction, '="run" title="Run the current algorithm"></a>',
      '</div>'].join('');
  }


  /* Constructor */

  function Toolbar() {
    var self = this;

    M.Events.mixinEvents(self);

    self.render();
    
    self.element.find(['.', _classTool].join(''))
      .on('click', $.proxy(itemSelect, self));
  }


  /* Prototype Methods */

  Toolbar.prototype.render = function render() {
    var self = this;

    if (!self.element) {
      self.element = $(_toolbarTmpl());
    }
  };


  /* Event Handers */

  function itemSelect(e) {
    var self = this,
        tool = $(e.target);

    self.dispatchEvent('itemSelect', {
      action: tool.attr(_attrAction)
    });
  }


  /* Expose */

  Q.Toolbar = Toolbar;

}(this, this.Quantum, this.Mixins, this.jQuery));
