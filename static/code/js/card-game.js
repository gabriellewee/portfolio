var $container = $('.cards');
$container.isotope({
	itemSelector: 'li',
	masonry: { columnWidth: 'li' }
});

$('#changelog-1, #changelog-2').click(function() {
	$(".changelog").addClass("visible");
});
$('#back').click(function() {
	$(".changelog").removeClass("visible");
});
$('#start, #play').click(function() {
	$("body").removeClass("success").addClass("begin");
	$container.isotope('shuffle');
	$('input').prop('checked', false);
	$('.selected-1, .selected-2, .complete').removeClass();
	window.setInterval(function(){
		$container.isotope('shuffle');
	}, 15000);
});
// $('#reset').click(function() {
// 	$('body').removeClass("success");
// 	$('input').prop('checked', false);
// 	$('.selected-1, .selected-2, .completed').removeClass();
// 	window.setInterval(function(){
// 		$container.isotope('shuffle');
// 	}, 250);
// });

$('input').click(function() {
	var card = $(this).parent().parent();
	if ($('.selected-1').length === 0) {
		card.addClass('selected-1');
	} else if ($('.selected-1').length === 1) {
		if (!$(this).parent().parent().hasClass("selected-1")) {
			card.addClass('selected-2');
		}
		var selectOne = $(".selected-1").children(".playing-card-container");
		var selectTwo = $(".selected-2").children(".playing-card-container");
		if ((selectOne.is('.play-ace')) && (selectTwo.is('.play-ace'))) {
			$('.selected-1, .selected-2').addClass("complete");
			setTimeout(function() {
				$('.complete').removeClass("selected-1 selected-2");
			}, 250);
		} else if ((selectOne.is('.play-two')) && (selectTwo.is('.play-two'))) {
			$('.selected-1, .selected-2').addClass("complete");
			setTimeout(function() {
				$('.complete').removeClass("selected-1 selected-2");
			}, 250);
		} else if ((selectOne.is('.play-jack')) && (selectTwo.is('.play-jack'))) {
			$('.selected-1, .selected-2').addClass("complete");
			setTimeout(function() {
				$('.complete').removeClass("selected-1 selected-2");
			}, 250);
		} else if ((selectOne.is('.play-queen')) && (selectTwo.is('.play-queen'))) {
			$('.selected-1, .selected-2').addClass("complete");
			setTimeout(function() {
				$('.complete').removeClass("selected-1 selected-2");
			}, 250);
		} else if ((selectOne.is('.play-king')) && (selectTwo.is('.play-king'))) {
			$('.selected-1, .selected-2').addClass("complete");
			setTimeout(function() {
				$('.complete').removeClass("selected-1 selected-2");
			}, 250);
		} else {
			setTimeout(function() {
				$('.selected-1, .selected-2').children('.playing-card-container').children('input').prop('checked', false);
			}, 250);
			setTimeout(function() {
				$('.selected-1, .selected-2').removeClass();
			}, 255);
		}
		if ($('.complete').length === 20 ) {
			$('body').removeClass("begin").addClass("success");
			for (i=0; i<100; i++){
				window.clearInterval(i);
			} 
		}
	}
});