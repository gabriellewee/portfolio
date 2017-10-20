+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){if(a(b.target).is(this))return b.handleObj.handler.apply(this,arguments)}})})}(jQuery);

$(function () {
	$(".loader").addClass("active");
	setTimeout(function(){
		$(".loader").removeClass("active");
		$(".loader").addClass("hide");
	}, 2000);
    if (document.cookie.indexOf("visited") >= 0) {
        $("#loader").hide();
    }
    else {
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
	$(function () {
	    $('.fluid').fluidbox();
		$(window).scroll(function() {
			$('.fluid').fluidbox('close');
		});
		$(document).keyup(function(e) {
		     if (e.keyCode == 27) {
		        $('.fluid').fluidbox('close');
		    }
		});
	});
} else { }

// retina
function isRetina() {
    var mediaQuery = "(-webkit-min-device-pixel-ratio:1.5),\
(min--moz-device-pixel-ratio:1.5),\
(-o-min-device-pixel-ratio:3/2),\
(min-resolution:1.5dppx)";
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

var $icons = $('.uguru-icon-grid').isotope({
	percentPosition: true,
    layoutMode: 'packery'
});
$(window).imagesLoaded(function(){
	setTimeout(function(){
		$icons.isotope({ filter: '.filter-featured' });
	}, 500);
});
$('.uguru-icon-filters').on('click', 'a', function() {
	var filterValue = $(this).attr('data-filter');
	$icons.isotope({ filter: filterValue });
});
$('.uguru-icon-filters').each(function(e, iconsFilter) {
	var $iconsFilter = $(iconsFilter);
	$iconsFilter.on('click', 'a', function() {
		$iconsFilter.find('.active').removeClass('active');
		$(this).addClass('active');
	});
});

// var $nav = $('.uguru-nav ul').isotope({
// 	percentPosition: true,
//     layoutMode: 'packery'
// });

var $cmpts = $('.uguru-component-grid').isotope({
	percentPosition: true,
    layoutMode: 'packery'
});
$(window).imagesLoaded(function(){
	setTimeout(function(){
		$cmpts.isotope({ filter: '.filter-featured' });
	}, 500);
});
$('.uguru-component-filters').on('click', 'a', function() {
	var filterValue = $(this).attr('data-filter');
	$cmpts.isotope({ filter: filterValue });
});
$('.uguru-component-filters').each(function(e, componentsFilter) {
	var $cmptsFilter = $(componentsFilter);
	$cmptsFilter.on('click', 'a', function() {
		$cmptsFilter.find('.active').removeClass('active');
		$(this).addClass('active');
	});
});

var $iterations = $('.uguru-iteration ul').isotope({
	percentPosition: true,
    layoutMode: 'packery'
});

$(window).imagesLoaded(function(){
	var $uguruContainers = $(".animated");

	$(".marker-link-active").click(function(){
		$(".place-marker").toggleClass("open").removeClass("shrink");
	});

	$(".marker-guru-active").click(function(){
		if ($(".place-marker").is(".expand")) {
			$(".place-marker").removeClass("expand").addClass("shrink");
		} else {
			$(".place-marker").addClass("expand").removeClass("shrink");
		}
	});

	$(".component-reset").click(function(){
		var $cmptReset = $(this).parent().siblings().find(".place-marker");
		$cmptReset.removeClass("expand open");
	});

	$(".component-expand").click(function(){
		var $cmptExp = $(this).parent().siblings().find(".place-marker");
		$cmptExp.addClass("open");
		setTimeout(function(){
			$cmptExp.addClass("expand");
		}, 750);
	});

	$(".component-animate").click(function(){
		var $cmptBtn = $(this);
		var $cmptAnim = $cmptBtn.parent().siblings().find(".animated");
		$cmptBtn.addClass("active");
		$cmptAnim.removeClass("with-hover").addClass("pre-enter");
		if ($cmptAnim.is(".place-marker")) {
			$cmptAnim.removeClass("expand open");
		}
		setTimeout(function(){
			$cmptAnim.addClass("on-enter");
		}, 500);
		setTimeout(function(){
			$cmptAnim.removeClass("pre-enter on-enter");
			setTimeout(function(){
				$cmptBtn.removeClass("active");
				$cmptAnim.addClass("with-hover");
			}, 50);
		}, 3000);
	});

	$(".animation-play").click(function(){
		var $animBtn = $(this);
		var $animPlay = $animBtn.siblings();
		$animBtn.addClass("active");
		setTimeout(function(){
			$animPlay.addClass("animated");
		}, 500);
		setTimeout(function(){
			$animPlay.addClass("fade-in");
			setTimeout(function(){
				$animBtn.removeClass("active");
				$animPlay.removeClass("fade-in animated");
			}, 750);
		}, 1750);
	});

	$('.uguru-carousel').flickity({
		cellSelector: '.uguru-carousel-item',
		adaptiveHeight: true,
	    imagesLoaded: true,
	    wrapAround: true,
	    pageDots: false,
	    selectedAttraction: 0.01,
	    friction: 0.15,
		percentPosition: true
	});

	$('.controls .button').each(function(index) {
		var moveClass = $('.' + $(this).attr('id'));
		var moving = moveClass.width();
		$(this).click(function(){
			var moveIndex = parseInt(moveClass.attr("data-index")) + 1;
			var moveAmt = parseInt(moveClass.attr("data-move")) - moving;
			setTimeout(function() {
				if (moveIndex == ($(".glasses").children().length + 1)) {
					moveClass.attr('data-move', 0);
					moveClass.attr('data-index', 1);
					moveClass.css("transform", "translateX(" + 0 + "px)")
				} else {
					moveClass.attr('data-move', moveAmt);
					moveClass.attr('data-index', moveIndex);
					moveClass.css("transform", "translateX(" + moveAmt + "px)")
				}
			}, 50);
		});
	});
});

$(".pf-main-link").click(function(){
	$(".pf-main-section.active").removeClass("active");
	if ($(this).siblings().is(".active")) {
		$(this).siblings().removeClass("active");
	}
	if ($(this).is(".pf-profile-section-link")) {
		$(".pf-profile-section-link, .pf-profile").addClass("active");
	} else if ($(this).is(".pf-portfolio-section-link")) {
		$(".pf-portfolio-section-link, .pf-portfolio").addClass("active");
	} else if ($(this).is(".pf-about-section-link")) {
		$(".pf-about-section-link, .pf-about").addClass("active");
	} else if ($(this).is(".pf-resources-section-link")) {
		$(".pf-resources-section-link, .pf-resources").addClass("active");
	}
});
