/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, $, undefined) {

  'use strict';

  var _key = 'layout.tblr';

  var _append = $.fn.append;

  function affixChild(parent, child) {
    var jParent = $(parent),
        jChild = $(child),
        jItem, jPrevItem,
        data = jParent.data(_key),
        cols = data.cols,
        colLen = cols.length,
        lastCol, i, len, item, prevItem,
        outerHeight = jParent.outerHeight(false),
        innerHeight = jParent.innerHeight(),
        maxWidth = jChild.outerWidth(false),
        maxHeight = jChild.outerHeight(false),
        left = 0,
        top = jParent.css('padding-top'),
        topMargin, bottomMargin;

    if (colLen > 1) {
      var prevCol = cols[colLen - 2];
      var marginLeft = prevCol.marginRight;
    } else {
      var marginLeft = jParent.css('padding-left');
    }

    if (colLen > 0) {
      var lastCol = cols[colLen - 1];
      var left = lastCol.left;
      var top = lastCol.top;

    }





    if (colLen > 0) {
      lastCol = cols[colLen - 1];

      for (i = 0, len = lastCol.items.length; i < len; i++) {
        item = lastCol.items[i];
        jItem = $(item);

        prevItem = null;
        jPrevItem = null;

        if (i > 0) {
          prevItem = lastCol.items[i - 1];
          jPrevItem = $(prevItem);
        }

        if (jPrevItem) {
          topMargin = Math.max(jPrevItem.css('margin-bottom'), jItem.css('margin-top'));
        } else {}
          topMargin = Math.max(jParent.css('padding-top'), jItem.css('margin-top'));
        }
      }
    }

    cols.push({
      items: [jChild],
      width: jChild.outerWidth(),
      height: jChild.outerHeight(),
      left: 0
    })
  }

  $.fn.tblr = function tblr() {
    var self = this;

    return self.each(function (i, element) {
      var jElement = $(element);

      jElement.data(_key, {
        cols: []
      });

      jElement.children().css('position', 'absolute').each(function (j, child) {
        affixChild(element, child);
      });
    });
  };

  $.fn.append = function append(content) {
    var self = this;

    if (!$.isFunction(content)) {
      return self.each(function (i, element) {
        var jElement = $(element);

        if (jElement.data(_key)) {
          _append.call(jElement, $(arguments).css('position', 'absolute').each(function (j, child) {
            affixChild(element, child);
          }));
        } else {
          _append.apply(jElement, arguments);
        }
      });
    } else {
      return _append.apply(self, arguments);
    }
  };

}(this, this.jQuery));
