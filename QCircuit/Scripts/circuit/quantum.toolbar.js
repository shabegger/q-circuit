/// <reference path="quantum.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Q, $, undefined) {

  'use strict';


  /* Private Variables */


  /* Templates */

  function _toolbarTmpl() {
    return [
      '<div class="q-toolbar">',
        '<a class="q-toolbar-tool q-toolbar-new" data-name="New" ',
           'title="Create a new algorithm"></a>',
        '<a class="q-toolbar-tool q-toolbar-open" data-name="Open" ',
           'title="Open an existing algorithm"></a>',
        '<a class="q-toolbar-tool q-toolbar-save" data-name="Save" ',
           'title="Save the current algorithm"></a>',
        '<a class="q-toolbar-tool q-toolbar-copy" data-name="Copy" ',
           'title="Save a copy of the current algorithm"></a>',
        '<a class="q-toolbar-tool q-toolbar-delete" data-name="Delete" ',
           'title="Delete the current algorithm"></a>',
        '<a class="q-toolbar-tool q-toolbar-execute" data-name="Execute" ',
           'title="Run the current algorithm"></a>',
      '</div>'].join('');
  }


  /* Constructor */

  function Toolbar() {
    var self = this;

    self.render();
  }


  /* Prototype Methods */

  Toolbar.prototype.render = function render() {
    var self = this;

    if (!self.element) {
      self.element = $(_toolbarTmpl());
    }
  };


  /* Instance Methods */


  /* Expose */

  Q.Toolbar = Toolbar;

}(this, this.Quantum, this.jQuery));
