/// <reference path="utility.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, Utility, $, undefined) {

  'use strict';


  /* Utilities */

  function once(fn, requireResult) {
    var executed = false,
        result;

    if (!$.isFunction(fn)) {
      throw new Error('Function required.');
    }

    return function () {
      if (!executed) {
        result = fn.apply(this, arguments);

        if (result || !requireResult) {
          executed = true;
        }
      }

      return result;
    };
  }


  /* Expose */

  Utility.Fn = {
    once: once
  };

}(this, this.Utility, this.jQuery));
