/// <reference path="ux/ux.js" />
/// <reference path="ux/ux.message.js" />
/// <reference path="jquery-1.10.2.intellisense.js" />

; (function (window, X, $, undefined) {

  'use strict';


  /* Private Variables */

  var _responsiveNavShowClass = 'main-login-show',
      _disclosureNavClass = 'main-login-disclosure',
      _message = new X.Message({ parent: 'body > footer' });


  /* Navigation */

  function hideNavigation(e) {
    $('header').removeClass(_responsiveNavShowClass);
  }

  function toggleNavigation(e) {
    $('header').toggleClass(_responsiveNavShowClass);
    e.stopPropagation();
  }


  /* Initialization */

  function attachEvents() {
    $(document).on('click', hideNavigation);
    $(window).on('resize', hideNavigation);
    $(['.', _disclosureNavClass].join('')).on('click', toggleNavigation);
  }

  $(function () {
    attachEvents();
  });


  /* Private Functions */

  function showMessage(message) {
    _message.show(message);
  }


  /* Expose */

  window.MainPage = {
    showMessage: showMessage
  };

}(this, this.UX, this.jQuery));
