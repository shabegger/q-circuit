/// <reference path="quantum.js" />

; (function (window, Q, undefined) {

  'use strict';


  /* Functions */

  function extend(target, source) {
    var prop;

    for (prop in source) {
      if (source.hasOwnProperty(prop) && !target.hasOwnProperty(prop)) {
        target[prop] = source[prop];
      }
    }
  }


  /* Expose */

  Q.Mixins = {
    extend: extend
  };

}(this, this.Quantum));