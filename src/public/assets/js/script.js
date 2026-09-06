if (1 !== window.devicePixelRatio) {
  var dpt = window.devicePixelRatio,
    widthM = window.screen.width * dpt;
  document.write('<meta name="viewport" content="width=640">');
}
$(function () {
  $("a").click(function () {
    if ("#" == $(this).attr("href").charAt(0)) {
      var t = $(this).attr("href");
      return (
        $("html, body").animate(
          { scrollTop: $(t).offset().top - $(".top-line").outerHeight() },
          500
        ),
        !1
      );
    }
  }),
    $(".mob-button").on("click", function () {
      $(".mob-button").toggleClass("active");
    }),
    $(".wrapper").on("click", function () {
      "0px" == $(".nav").css("left") && $(".mob-button").removeClass("active");
    }),
    $(".popup__wrapper").on("click", function (t) {
      $(t.target).closest(".popup__block").length || $(this).hide();
    }),
    $(".timer").eq(0).FlipClock(10300, { countdown: !0, language: "it" }),
    $(".timer").eq(1).FlipClock(10300, { countdown: !0, language: "it" }),
    $(".timer").eq(2).FlipClock(10300, { countdown: !0, language: "it" }),
    $(".timer").eq(3).FlipClock(10300, { countdown: !0, language: "it" }),
    $(".timer").eq(4).FlipClock(10300, { countdown: !0, language: "it" }),
    $(".timer").eq(5).FlipClock(10300, { countdown: !0, language: "it" }),
    $(".sostav__slider").owlCarousel({
      nav: !0,
      dots: !1,
      navText: "",
      loop: !0,
      MouseDrag: !0,
      responsive: {
        992: { items: 2 },
        640: { dots: !0, items: 1, autoHeight: !0 },
        0: { autoHeight: !0, items: 1 },
      },
    }),
    $(".reviews__slider").owlCarousel({
      nav: !1,
      dots: !0,
      navText: "",
      loop: !0,
      dotsEach: !0,
      responsive: {
        768: { items: 3 },
        640: { items: 1, autoHeight: !0 },
        0: { autoHeight: !0, items: 1 },
      },
    }),
    $(window).outerWidth() <= 768 &&
      ($('a[href="#zakaz"]').attr("href", "#mob-zakaz"),
      $(".topSix__itemG.owl-carousel").owlCarousel({
        nav: !0,
        dots: !1,
        navText: "",
        loop: !0,
        autoHeight: !1,
        dotsEach: !0,
        items: 1,
      }),
      $(".numberTwo__item-cubes.owl-carousel").owlCarousel({
        nav: !0,
        dots: !1,
        navText: "",
        loop: !0,
        autoHeight: !1,
        dotsEach: !0,
        items: 1,
      }));
  var t;
  $(".packCount").text(((t = 1e3 + 3001 * Math.random()), (t = Math.floor(t))));
  setInterval(function () {
    $(".packCount").text(
      parseInt($(".packCount").eq(0).text()) +
        (function () {
          var t = 1 + 20 * Math.random();
          return Math.floor(t);
        })()
    );
  }, 15e3);
});
