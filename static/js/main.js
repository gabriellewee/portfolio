+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){if(a(b.target).is(this))return b.handleObj.handler.apply(this,arguments)}})})}(jQuery);

$(function () {
	$(".loader").addClass("active");
	setTimeout(function(){
		$(".loader").removeClass("active");
		$(".loader").addClass("hide");
	}, 2000);
	setTimeout(function(){
		$(".cube-container").addClass("active");
	}, 3500);
    if (document.cookie.indexOf("visited") >= 0) {
        $("#loader").hide();
    } else {
        var cookieExpiry = new Date();
        cookieExpiry.setTime(cookieExpiry.getTime() + (8 * 3600 * 1000));
        document.cookie = "visited=yes; expires=" + cookieExpiry.toGMTString();
		$("#loader").addClass("active");
		setTimeout(function(){
			$("#loader").removeClass("active");
			$("#loader").addClass("hide");
		}, 4150);
    }
});

if(!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)){
	$(window).imagesLoaded(function(){
		setTimeout(function(){
			var s = skrollr.init({
				forceHeight: false,
				smoothScrolling: true,
				smoothScrollingDuration: 300
			});
			if (document.querySelector('#page-home')!=null) {
				skrollr.menu.init(s, {
				    animate: true,
				    easing: 'sqrt',
				    scale: 2,
				    duration: function(currentTop, targetTop) {
				        // return 500;
				        return Math.abs(targetTop - currentTop) / 5;
				    },
				    updateUrl: false
				});
			}
		}, 500);
	});
} else {
    $("body").addClass("no-skrollr");
}

// retina
function isRetina() {
    var mediaQuery = "(-webkit-min-device-pixel-ratio:1.5),\
(min--moz-device-pixel-ratio:1.5),\
(-o-min-device-pixel-ratio:3/2),\
(min-resolution:1.5dppx),\
(min-width:1440px)";
    if (window.devicePixelRatio > 1) return true;
    if (window.matchMedia && window.matchMedia(mediaQuery).matches) return true;
    return false
};
function retina() {
    if (!isRetina()) return;
    $(".2x").map(function(i, image) {
        if ($(image).is("img")) {
			var path = $(image).attr("src");
	        path = path.replace(".png", "@2x.png");
	        path = path.replace(".jpg", "@2x.jpg");
	        $(image).attr("src", path);
		} else if ($(image).is("image")) {
			var path = $(image).attr("xlink:href");
	        path = path.replace(".png", "@2x.png");
	        path = path.replace(".jpg", "@2x.jpg");
	        $(image).attr("xlink:href", path);
		} else {
			$(image).addClass("retina");
			var path = $(image).attr("style");
	        path = path.replace(".png", "@2x.png");
	        path = path.replace(".jpg", "@2x.jpg");
	        $(image).attr("style", path);
		}
    });
};
$(document).ready(retina);

var $projects = $('.grid-projects').isotope({
	percentPosition: true,
	layoutMode: 'packery',
    itemSelector: 'li'
});
$('.project-filters').on('click', 'a', function() {
  var filterValue = $(this).attr('data-filter');
  $projects.isotope({ filter: filterValue });
});
$('.project-filters').each(function(e, projectFilter) {
	var $projectFilter = $(projectFilter);
	$projectFilter.on('click', 'a', function() {
		if ($(this).attr('data-filter') == '*') {
			$projectFilter.find('.active').removeClass('active');
		} else {
			$projectFilter.find('.active').removeClass('active');
			$(this).addClass('active');
		}
	});
});

var $graphics = $('.grid-graphics').isotope({
	percentPosition: true,
	layoutMode: 'packery',
    itemSelector: 'li'
});
$graphics.imagesLoaded().progress(function() {
	$graphics.isotope('layout');
});
$('.design-filters').on('click', 'a', function() {
  var filterValue = $(this).attr('data-filter');
  $graphics.isotope({ filter: filterValue });
});
$('.design-filters').each(function(e, designFilter) {
	var $designFilter = $(designFilter);
	$designFilter.on('click', 'a', function() {
		if ($(this).attr('data-filter') == '*') {
			$designFilter.find('.active').removeClass('active');
		} else {
			$designFilter.find('.active').removeClass('active');
			$(this).addClass('active');
		}
	});
});

var $art = $('.grid-art').isotope({
	percentPosition: true,
	layoutMode: 'packery',
    itemSelector: 'li'
});
$art.imagesLoaded().progress(function() {
	$art.isotope('layout');
});
$('.art-filters').on('click', 'a', function() {
  var filterValue = $(this).attr('data-filter');
  if ($(this).attr('data-filter')=="*") {
	  $art.children('li').removeClass("full");
  } else {
	  $art.children('li').addClass("full").css("opacity", "1");
  }
  setTimeout(function(){
	  $art.isotope({ filter: filterValue });
  }, 150);
});
$('.art-filters').each(function(e, artFilter) {
	var $artFilter = $(artFilter);
	$artFilter.on('click', 'a', function() {
		if ($(this).attr('data-filter') == '*') {
			$artFilter.find('.active').removeClass('active');
		} else {
			$artFilter.find('.active').removeClass('active');
			$(this).addClass('active');
		}
	});
});

var $thumbnails = $('.grid-thumbnails').isotope({
	percentPosition: true,
	layoutMode: 'packery',
    itemSelector: 'li'
});
$thumbnails.imagesLoaded().progress(function() {
	$thumbnails.isotope('layout');
});

$(".play-pause").click(function(){
	$(this).toggleClass("play-anim");
	$(this).parent().siblings(".svg-animate").toggleClass("animated");
});
