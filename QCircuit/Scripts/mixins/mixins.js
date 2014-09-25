; (function (window, undefined) {

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

  window.Mixins = {
    __namespace: true,
    extend: extend
  };

}(this));
