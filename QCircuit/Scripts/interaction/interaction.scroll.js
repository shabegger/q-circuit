/// <reference path="interaction.js" />
/// <reference path="interaction.animation.js" />
/// <reference path="interaction.touch.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />

; (function (window, $, undefined) {

  'use strict';


  /* Private Variables */

  var _horzScrollFn = 'scrollLeft',
      _vertScrollFn = 'scrollTop',
      _delay = 200,
      _smallStep = (5 * 75) / 1000,
      _bigStep = 75;


  /* Scroll Animation */

  function scrollStep(options) {
    var now = (new Date()).valueOf();

    if (!options.scrolling && (now - options.start) > _delay) {
      options.scrolling = true;
    }

    if (options.scrolling) {
      options.scrollPos +=
        options.direction * _smallStep * (now - options.lastFrame);
      $(options.container)[options.scrollFn](options.scrollPos);
    }

    options.lastFrame = now;
    options.requestId =
      window.requestAnimationFrame($.proxy(scrollStep, null, options));
  }


  /* Event Handlers */

  function onDown(options, e) {
    var button = this;

    if (button.filter(options.left).length ||
        button.filter(options.right).length) {
      options.scrollFn = _horzScrollFn;
    } else {
      options.scrollFn = _vertScrollFn;
    }

    if (button.filter(options.left).length ||
        button.filter(options.up).length) {
      options.direction = -1;
    } else {
      options.direction = 1;
    }

    options.start = options.lastFrame = (new Date()).valueOf();
    options.scrolling = false;
    options.scrollPos = $(options.container)[options.scrollFn]();
    options.requestId =
      window.requestAnimationFrame($.proxy(scrollStep, null, options));

    options.clickDown && options.clickDown.call(button);
  }

  function onUp(options, e) {
    var button = this;

    // If scrolling hasn't started, take one big step
    if (!options.scrolling) {
      options.scrollPos += options.direction * _bigStep;
      $(options.container)[options.scrollFn](options.scrollPos);
    }

    window.cancelAnimationFrame(options.requestId);
    options.clickUp && options.clickUp.call(button);
  }


  /* jQuery Plugins */

  //  options
  //    left: element to use as the left button
  //    right: element to use as the right button
  //    up: element to use as the up button
  //    down: element to use as the down button
  //    clickDown: callback when mouse/touch occurs
  //    clickUp: callback when mouse/touch released
  $.fn.scrollable = function scrollable(options) {
    var container = this;

    options = $.extend({
      container: container
    }, options);

    if (options.left && options.right) {
      $(options.left).onInteractionDown($.proxy(onDown, null, options))
        .onInteractionUp($.proxy(onUp, null, options))
        .onInteractionCancel($.proxy(onUp, null, options));
      $(options.right).onInteractionDown($.proxy(onDown, null, options))
        .onInteractionUp($.proxy(onUp, null, options))
        .onInteractionCancel($.proxy(onUp, null, options));
    }

    if (options.up && options.down) {
      $(options.up).onInteractionDown($.proxy(onDown, null, options))
        .onInteractionUp($.proxy(onUp, null, options))
        .onInteractionCancel($.proxy(onUp, null, options));
      $(options.down).onInteractionDown($.proxy(onDown, null, options))
        .onInteractionUp($.proxy(onUp, null, options))
        .onInteractionCancel($.proxy(onUp, null, options));
    }
  };

}(this, this.jQuery));
