/// <reference path="mixins.js" />

; (function (window, Bugfix, undefined) {

  'use strict';


  /* Bug Checks */

  function isBugFlexWidth() {
    var testHTML,
        testElement,
        result;
    
    testHTML = [
      '<div style="position: absolute;',
                  'left: -1000;',
                  'display: -webkit-inline-box;',
                  'display: -moz-inline-box;',
                  'display: -ms-inline-flexbox;',
                  'display: -webkit-inline-flex;',
                  'display: inline-flex;',
                  'flex-flow: column wrap;',
                  'margin: 0;',
                  'padding: 0;',
                  'height: 1px;">',
        '<div style="display: inline-block;',
                    'margin: 0;',
                    'padding: 0;',
                    'width: 1px;',
                    'height: 1px;"></div>',
        '<div style="display: inline-block;',
                    'margin: 0;',
                    'padding: 0;',
                    'width: 1px;',
                    'height: 1px;"></div>',
      '</div>'
    ].join('');

    testElement = $(testHTML).appendTo('body');
    result = testElement.width() !== 2;

    testElement.remove();

    return result;
  }


  /* Bug Fixes */

  function fixFlexWidth() {
    if (isBugFlexWidth()) {

    }
  }


  /* Expose */

  Bugfix.Flex = {
    isBugFlexWidth: isBugFlexWidth,
    fixFlexWidth: fixFlexWidth
  };

}(this, this.Bugfix));
