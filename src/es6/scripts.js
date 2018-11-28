//
// Scripts.js
// =============================================================================
/* eslint-disable semi */
/* globals WOW */

// Smooth scroll
$(() => {
  $('a[href*="#"]')
    .not('[href="#"]')
    .click(function() {
      if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
        location.hostname == this.hostname
      ) {
        let target = $(this.hash);
        target = target.length ? target : $(`[name=${this.hash.slice(1)}]`);

        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
});

// Init WOW.js
(() => {
  let w;
  w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  if (w > 1200) {
    new WOW().init();
  }
}).call(this);
