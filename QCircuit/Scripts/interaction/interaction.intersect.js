/// <reference path="interaction.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, UI, $, undefined) {

  'use strict';

    
  /* Private Functions */

  function elementCenter(elem) {
    var offset = elem.offset(),
        width = elem.outerWidth(),
        height = elem.outerHeight();

    return {
      x: offset.left + (width / 2),
      y: offset.top + (height / 2)
    };
  }

  function elementBounds(elem) {
    var offset = elem.offset(),
        top = offset.top,
        left = offset.left,
        width = elem.outerWidth(),
        height = elem.outerHeight();

    return {
      top: top,
      left: left,
      bottom: top + height,
      right: left + width
    };
  }

  function elementsIntersect(elem1, elem2) {
    var bounds1 = elementBounds(elem1),
        bounds2 = elementBounds(elem2),
        left1 = bounds1.left, left2 = bounds2.left,
        top1 = bounds1.top, top2 = bounds2.top,
        right1 = bounds1.right, right2 = bounds2.right,
        bottom1 = bounds1.bottom, bottom2 = bounds2.bottom;

    return ((left1 <= left2 && right1 > left2) ||
      (left2 <= left1 && right2 > left1)) &&
      ((top1 <= top2 && bottom1 > top2) ||
      (top2 <= top1 && bottom2 > top1));
  }

  function elementIntersectsPoint(elem, x, y) {
    var bounds = elementBounds(elem);

    return (bounds.left < x) && (bounds.right > x) &&
      (bounds.top < y) && (bounds.bottom > y);
  }

  function elementIntersectsCenter(elem1, elem2) {
    var center = elementCenter(elem2);

    return elementIntersectsPoint(elem1, center.x, center.y);
  }


  /* jQuery Plugins */

  $.fn.center = function center() {
    return elementCenter(this);
  };

  $.fn.bounds = function bounds() {
    return elementBounds(this);
  };

  $.fn.intersects = function intersects(element) {
    return elementsIntersect(this, element);
  };

  $.fn.intersectsPoint = function intersectsPoint(x, y) {
    return elementIntersectsPoint(this, x, y);
  };

  $.fn.intersectsCenter = function intersectsCenter(element) {
    return elementIntersectsCenter(this, element);
  };

}(this, this.Interaction, this.jQuery));
