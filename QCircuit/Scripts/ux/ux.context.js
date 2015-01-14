/// <reference path="ux.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, X, $, undefined) {

  'use strict';


  /* Private Variables */

  var _instance = null;


  /* Templates */

  function _contextTmpl() {
    return [
      '<div class="ux-context" style="display: none;">',
        '<ul></ul>',
      '</div>'].join('');
  }

  function _itemTmpl(item) {
    return [
      '<li>', item.title, '</li>'].join('');
  }


  /* Constructor */

  function ContextMenu() {
    var self = this,
        vars = {};

    self.setContextMenu = $.proxy(setContextMenu, self, vars);

    vars.element = $(_contextTmpl()).appendTo('body')
      .on('click', $.proxy(click, self, vars));

    $(document)
      .on('contextmenu', $.proxy(show, self, vars))
      .on('click blur', $.proxy(hide, self, vars));
  }


  /* Instance Methods */

  function setContextMenu(vars, items) {
    vars.items = items;
  };


  /* Event Handlers */

  function show(vars, e) {
    var self = this,
        element = vars.element,
        list = element.find('ul'),
        event,
        items,
        i, len,
        body,
        x, y, w, h,
        transform;

    list.empty();
    vars.items = null;

    event = $.Event('beforecontext');
    event.menu = self;
    $(e.target).trigger(event);

    items = vars.items;
    if (items && items.length) {
      for (i = 0, len = items.length; i < len; i++) {
        list.append(_itemTmpl(items[i]));
      }

      body = $('body');

      w = element.outerWidth();
      h = element.outerHeight();

      x = Math.max(0, Math.min(e.clientX, body.innerWidth() - w));
      y = Math.max(0, Math.min(e.clientY, body.innerHeight() - h));

      transform = ['translate(', x, 'px, ', y, 'px)'].join('');
      element.css({
        '-ms-transform': transform,
        '-webkit-transform': transform,
        'transform': transform
      });

      element.show();
    } else {
      element.hide();
    }

    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  }

  function hide(vars, e) {
    vars.element.hide();
  }

  function click(vars, e) {
    var self = this,
        listItem = $(e.target),
        item;

    vars.element.hide();
    
    if (!listItem.is('li')) {
      listItem = listItem.closest('li');
    }

    if (!listItem.length) {
      return;
    }

    item = vars.items[listItem.index()];
    item && $.isFunction(item.callback) && item.callback.call(self);
  }


  /* Global Initialization */

  _instance = new ContextMenu();


  /* Singleton */

  function getInstance() {
    return _instance;
  }


  /* Expose */

  X.ContextMenu = getInstance;

}(this, this.UX, this.jQuery));
