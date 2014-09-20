/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, $, undefined) {

  'use strict';


  /* UI Element Prototype */

  function UIElement(templateFn) {
    var self = this;

    if ($.isFunction(templateFn)) {
      self.element = $(templateFn());
    }
  }

  UIElement.prototype.render = function render() { };

  UIElement.prototype.appendChild = function appendChild(element, child) {
    element.append(child.element);
    child.render();
  };


  window.Quantum = {
    __namespace: true,
    UIElement: UIElement
  };

}(this, this.jQuery));
