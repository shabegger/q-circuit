/// <reference path="quantum.js" />

; (function (window, Q, SVG, undefined) {

  'use strict';


  /* Constructor */

  function WorkSpace(elementId) {
    var self = this;

    self.svg = SVG(elementId);
  }


  /* Expose */

  Q.WorkSpace = WorkSpace;

}(this, this.Quantum, this.SVG));