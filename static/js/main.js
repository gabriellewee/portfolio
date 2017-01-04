// retina
function isRetina(){var mediaQuery="(-webkit-min-device-pixel-ratio:1.5),\
(min--moz-device-pixel-ratio:1.5),\
(-o-min-device-pixel-ratio:3/2),\
(min-resolution:1.5dppx)";if(window.devicePixelRatio>1)return true;if(window.matchMedia&&window.matchMedia(mediaQuery).matches)return true;return false};function retina(){if(!isRetina())return;$("img.2x").map(function(i,image){var path=$(image).attr("src");path=path.replace(".png","@2x.png");path=path.replace(".jpg","@2x.jpg");$(image).attr("src",path)})};
$(document).ready(retina);

+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){if(a(b.target).is(this))return b.handleObj.handler.apply(this,arguments)}})})}(jQuery);

// var closeFn;
// function closeShowingModal() {
//     var showingModal = document.querySelector('.modal.show');
//     if (!showingModal) return;
//     showingModal.classList.remove('show');
//     document.body.classList.remove('disable-mouse');
//     document.body.classList.remove('disable-scroll');
//     if (closeFn) {
//         closeFn();
//         closeFn = null;
//     }
// }
// function showNextModal() {
//     var showingModal = document.querySelector('.modal.show');
//     if (!showingModal) return;
//     if ($(showingModal).is(":last-child")) {
//         showingModal.classList.remove('show');
//         document.body.classList.remove('disable-mouse');
//         document.body.classList.remove('disable-scroll');
//         if (closeFn) {
//             closeFn();
//             closeFn = null;
//         }
//     }
//     else {
//         showingModal.classList.remove('show');
//         $(showingModal).next().addClass("show");
//     }
// }
// function showPrevModal() {
//     var showingModal = document.querySelector('.modal.show');
//     if (!showingModal) return;
//     if ($(showingModal).is(":first-child")) {
//         showingModal.classList.remove('show');
//         document.body.classList.remove('disable-mouse');
//         document.body.classList.remove('disable-scroll');
//         if (closeFn) {
//             closeFn();
//             closeFn = null;
//         }
//     }
//     else {
//         showingModal.classList.remove('show');
//         $(showingModal).prev().addClass("show");
//     }
// }
// document.addEventListener('click', function (e) {
//     var target = e.target;
//     if (target.dataset.ctaTarget) {
//         closeFn = cta(target, document.querySelector(target.dataset.ctaTarget), { relativeToWindow: true }, function showModal(modal) {
//             modal.classList.add('show');
//             document.body.classList.add('disable-mouse');
//             if(target.dataset.disableScroll){
//                 document.body.classList.add('disable-scroll');
//             }
//         });
//     }
//     else if (target.classList.contains('modal-close')) {
//         closeShowingModal();
//     }
//     else if (target.parentElement.classList.contains('modal-close')) {
//         closeShowingModal();
//     }
// });
// document.addEventListener('keyup', function (e) {
//     if (e.which === 27) {
//         closeShowingModal();
//     } else if (e.which === 39) {
//         showNextModal();
//     } else if (e.which === 37) {
//         showPrevModal();
//     }
// });

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
	$(window).imagesLoaded(function(){
		setTimeout(function(){
			var s = skrollr.init({
				forceHeight: false,
				smoothScrolling: true,
				smoothScrollingDuration: 300
			});
			skrollr.menu.init(s, {
			    animate: true,
			    easing: 'sqrt',
			    scale: 2,
			    duration: function(currentTop, targetTop) {
			        // return 500;
			        return Math.abs(targetTop - currentTop) / 7;
			    },
			    updateUrl: false
			});
		}, 500);
	});
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
} else {
    $("body").addClass("no-skrollr");
}

var elem = document.querySelector('.project-carousel');
var flkty = new Flickity( elem, {
	cellSelector: '.project-carousel-item',
	adaptiveHeight: true,
    imagesLoaded: true,
    wrapAround: true,
    pageDots: false,
    selectedAttraction: 0.01,
    friction: 0.15,
	percentPosition: true
});

var $projects = $('.grid-projects').isotope({
	percentPosition: true,
    itemSelector: 'li',
    masonry: {
  	  columnWidth: 'li'
    }
});
$('.project-filters').on( 'click', 'a', function() {
  var filterValue = $(this).attr('data-filter');
  $projects.isotope({ filter: filterValue });
});

var $graphics = $('.grid-graphics').isotope({
	percentPosition: true,
    itemSelector: 'li',
    masonry: {
  		columnWidth: '.sizer'
    }
});
$graphics.imagesLoaded().progress( function() {
	$graphics.isotope('layout');
});
$('.design-filters').on( 'click', 'a', function() {
  var filterValue = $(this).attr('data-filter');
  $graphics.isotope({ filter: filterValue });
});

var $art = $('.grid-art').isotope({
	percentPosition: true,
    itemSelector: 'li',
    masonry: {
  		columnWidth: '.sizer'
    }
});
$art.imagesLoaded().progress( function() {
	$art.isotope('layout');
});
$('.art-filters').on( 'click', 'a', function() {
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

var $thumbnails = $('.grid-thumbnails').isotope({
	percentPosition: true,
    itemSelector: 'li',
    masonry: {
  		columnWidth: '.sizer'
    }
});
$thumbnails.imagesLoaded().progress( function() {
	$thumbnails.isotope('layout');
});

// var $uguru = $('.grid-uguru').isotope({
// 	percentPosition: true,
//     itemSelector: 'li',
//     masonry: {
//   		columnWidth: '.sizer'
//     }
// });
// $uguru.imagesLoaded().progress( function() {
// 	$uguru.isotope('layout');
// });
