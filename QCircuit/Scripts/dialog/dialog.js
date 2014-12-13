/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, $, undefined) {

  'use strict';


  /* Templates */

  function _dialogTmpl() {
    return [
      '<div class="dialog-container" style="display: none;">',
        '<div class="dialog-overlay"></div>',
        '<div class="dialog-window"></a>',
      '</div>'].join('');
  }


  /* Constructor */

  function Dialog() {
    var self = this,
        vars = {};

    vars.element = $(_dialogTmpl()).appendTo('body');

    self.show = $.proxy(show, self, vars);
    self.hide = $.proxy(hide, self, vars);
  }


  /* Instance Methods */

  function show(vars) {
    vars.element.show();
  }

  function hide(vars) {
    vars.element.hide();
  }


  /* Expose */

  window.Dialog = Dialog;

}(this, jQuery));
