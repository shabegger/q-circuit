; (function (window, $, undefined) {

  'use strict';


  /* Private Variables */

  var _responsiveNavShowClass = 'main-login-show',
      _disclosureNavClass = 'main-login-disclosure';


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

}(this, this.jQuery));
