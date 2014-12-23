/// <reference path="ux.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, X, $, undefined) {

  'use strict';


  /* Private Variables */

  var _classHidden = 'ux-hidden';

  var _options = {
    parent: 'body',
    timeout: 5000
  };


  /* Templates */

  function _messageTmpl() {
    return [
      '<span class="ux-message ', _classHidden, '">',
      '</span>'].join('');
  }


  /* Constructor */

  function Message(options) {
    var self = this,
        vars = {};

    options = $.extend({}, _options, options);

    vars.element = $(_messageTmpl()).appendTo(options.parent);
    vars.timeout = options.timeout;

    self.show = $.proxy(show, self, vars);

    vars.hide = $.proxy(hide, self, vars);
  }


  /* Instance Methods */

  function show(vars, message) {
    vars.element.text(message || '').removeClass(_classHidden);
    window.console && window.console.log && message &&
      window.console.log(message);

    if (vars.timeout) {
      clearTimeout(vars.timeoutId);
      vars.timeoutId = setTimeout(vars.hide, vars.timeout);
    }
  }


  /* Private Helpers */

  function hide(vars) {
    vars.element.addClass(_classHidden);
  }


  /* Expose */

  X.Message = Message;

}(this, this.UX, this.jQuery));
