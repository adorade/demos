/*!
 * Demos (v1.0.0): scripts.js
 * Static Site build with Gulp
 * Copyright (c) 2019 Adorade (https://adorade.ro)
 * License under MIT (https://github.com/adorade/demos/blob/master/LICENSE)
 * ============================================================================
 */
$(function () {
  $('a[href*="#"]').not('[href="#"]').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");

      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});
(function () {
  var w;
  w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  if (w > 1200) {
    new WOW().init();
  }
}).call(this);
//# sourceMappingURL=maps/scripts.js.map