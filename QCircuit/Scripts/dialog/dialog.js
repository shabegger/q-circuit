/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, $, undefined) {

  'use strict';


  /* Private Variables */

  var _options = {
    title: '',
    content: '',
    tools: []
  };


  /* Templates */

  function _dialogTmpl(options) {
    return [
      '<div class="dialog-container" style="display: none;">',
        '<div class="dialog-overlay"></div>',
        '<div class="dialog-window">',
          '<header>', options.title, '</header>',
          '<section>', options.content, '</section>',
          '<footer></footer>',
        '</div>',
      '</div>'].join('');
  }

  function _toolTmpl(options) {
    return [
      '<input type="button" value="', options.title, '">'].join('');
  }


  /* Constructor */

  function Dialog(options) {
    var self = this,
        vars = {},
        i, len,
        footer,
        tool, callback;

    options = $.extend({}, _options, options);

    vars.element = $(_dialogTmpl(options)).appendTo('body');
    
    footer = vars.element.find('footer');
    for (i = 0, len = options.tools.length; i < len; i++) {
      tool = options.tools[i];
      callback = $.isFunction(tool.callback) ? tool.callback : $.noop;

      $(_toolTmpl(tool)).appendTo(footer)
        .on('click', $.proxy(callback, self));
    }

    self.content = $.proxy(content, self, vars);
    self.html = $.proxy(html, self, vars);
    self.show = $.proxy(show, self, vars);
    self.hide = $.proxy(hide, self, vars);
  }


  /* Instance Methods */

  function content(vars) {
    return vars.element.find('section');
  }

  function html(vars, content) {
    return vars.element.find('section').html(content);
  }

  function show(vars) {
    vars.element.show();
  }

  function hide(vars) {
    vars.element.hide();
  }


  /* Expose */

  window.Dialog = Dialog;

}(this, jQuery));
