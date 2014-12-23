/// <reference path="ux.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, X, $, undefined) {

  'use strict';


  /* Private Variables */

  var _instance = null;


  /* Templates */

  function _spinnerTmpl() {
    return [
      '<div class="ux-container" style="display: none;">',
        '<div class="ux-overlay"></div>',
        '<div class="ux-spinner"></div>',
      '</div>'].join('');
  }


  /* Constructor */

  function Spinner() {
    var self = this,
        vars = {};

    vars.element = $(_spinnerTmpl()).appendTo('body');

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


  /* Singleton */

  function getInstance() {
    _instance = _instance || new Spinner();
    return _instance;
  }


  /* Expose */

  X.Spinner = getInstance;

}(this, this.UX, this.jQuery));
