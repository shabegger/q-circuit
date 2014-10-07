/// <reference path="interaction.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, UI, $, undefined) {

  'use strict';


  /* Private Variables */

  var _namespace = 'interaction-drop',
      _droppables = null;


  /* jQuery Plugins */

  $.fn.droppable = function droppable(fn) {
    var self = this;

    if ($.isFunction(fn)) {
      self.data(_namespace, fn);

      if (_droppables) {
        _droppables.add(self);
      } else {
        _droppables = self;
      }
    }

    return self;
  };

}(this, this.Interaction, this.jQuery));
