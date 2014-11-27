/// <reference path="bugfix.js" />

; (function (window, Bugfix, undefined) {

  'use strict';


  /* Private Variables */

  var _isFixedFlexWidth = false,
      _isFixedFlexWidthReset = false;


  /* Private Helpers */

  function isFlexContainer(element) {
    var display = element.css('display');

    return display === 'flex' ||
           display === 'inline-flex' ||
           display === '-webkit-flex' ||
           display === '-webkit-inline-flex' ||
           display === '-ms-flexbox' ||
           display === '-ms-inline-flexbox' ||
           display === '-moz-box' ||
           display === '-moz-inline-box' ||
           display === '-webkit-box' ||
           display === '-webkit-inline-box';
  }

  function calculateFlexWidth(element) {
    var offset, padding,
        lastChild, childOffset, childWidth,
        width;

    element.css('width', '');

    offset = element.offset();
    padding = parseFloat(element.css('padding-right'));
    lastChild = element.children(':last-child');
    childOffset = lastChild.offset();
    childWidth = lastChild.outerWidth();

    padding = isNaN(padding) ? 0 : padding;
    width = Math.max(0, childOffset.left - offset.left + childWidth + padding);

    element.css('width', width);

    return width;
  }

  function resetAutoFlexWidth(element) {
    element.css('width', 'auto');
    setTimeout(function () {
      element.css('width', '');
    }, 0);
  }


  /* Bug Checks */

  function isBugFlexWidth() {
    var testHTML,
        testElement,
        result;
    
    testHTML = [
      '<div class="bugfix-flex-container">',
        '<div class="bugfix-flex-item"></div>',
        '<div class="bugfix-flex-item"></div>',
      '</div>'
    ].join('');

    testElement = $(testHTML).appendTo('body');
    result = testElement.width() !== 2;

    testElement.remove();

    return result;
  }

  function isBugFlexWidthReset() {
    var testHTML,
        testElement,
        firstWidth,
        secondWidth;

    testHTML = [
      '<div class="bugfix-flex-container">',
        '<div class="bugfix-flex-item"></div>',
        '<div class="bugfix-flex-item"></div>',
      '</div>'
    ].join('');

    testElement = $(testHTML).appendTo('body');
    
    firstWidth = testElement.width();
    testElement.addClass('bugfix-mod-height');
    secondWidth = testElement.width();

    testElement.remove();

    return firstWidth === secondWidth;
  }


  /* Bug Fixes */

  function fixFlexWidth() {
    var _append,
        _addClass,
        _removeClass;

    if (!_isFixedFlexWidth && isBugFlexWidth()) {
      _append = $.fn.append;
      $.fn.append = function append() {
        var result = _append.apply(this, arguments),
            parent = this.parent();

        if (isFlexContainer(this)) {
          calculateFlexWidth(this);
        }

        if (isFlexContainer(parent)) {
          calculateFlexWidth(parent);
        }

        return result;
      };

      _addClass = $.fn.addClass;
      $.fn.addClass = function addClass() {
        var result = _addClass.apply(this, arguments),
            descendants = this.find('*');

        $(descendants.get().reverse()).each(function (index, element) {
          element = $(element);
          if (isFlexContainer(element)) {
            calculateFlexWidth(element);
          }
        });

        if (isFlexContainer(this)) {
          calculateFlexWidth(this);
        }

        return result;
      };

      _removeClass = $.fn.removeClass;
      $.fn.removeClass = function removeClass() {
        var result = _removeClass.apply(this, arguments),
            descendants = this.find('*');

        $(descendants.get().reverse()).each(function (index, element) {
          element = $(element);
          if (isFlexContainer(element)) {
            calculateFlexWidth(element);
          }
        });

        if (isFlexContainer(this)) {
          calculateFlexWidth(this);
        }

        return result;
      };
    }

    _isFixedFlexWidth = true;
  }

  function fixFlexWidthReset() {
    var _addClass,
        _removeClass;

    if (!_isFixedFlexWidthReset && !isBugFlexWidth() && isBugFlexWidthReset()) {
      _addClass = $.fn.addClass;
      $.fn.addClass = function addClass() {
        var result = _addClass.apply(this, arguments),
            descendants = this.find('*');

        $(descendants.get().reverse()).each(function (index, element) {
          element = $(element);
          if (isFlexContainer(element)) {
            resetAutoFlexWidth(element);
          }
        });

        if (isFlexContainer(this)) {
          resetAutoFlexWidth(this);
        }

        return result;
      };

      _removeClass = $.fn.removeClass;
      $.fn.removeClass = function removeClass() {
        var result = _removeClass.apply(this, arguments),
            descendants = this.find('*');

        $(descendants.get().reverse()).each(function (index, element) {
          element = $(element);
          if (isFlexContainer(element)) {
            resetAutoFlexWidth(element);
          }
        });

        if (isFlexContainer(this)) {
          resetAutoFlexWidth(this);
        }

        return result;
      };
    }

    _isFixedFlexWidthReset = true;
  }


  /* Expose */

  Bugfix.Flex = {
    isBugFlexWidth: isBugFlexWidth,
    fixFlexWidth: fixFlexWidth,
    isBugFlexWidthReset: isBugFlexWidthReset,
    fixFlexWidthReset: fixFlexWidthReset
  };

}(this, this.Bugfix));
