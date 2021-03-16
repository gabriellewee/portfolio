(function ($) {
	$.fn.fluidVids = function (options) {
		return this.each(function () {
			obj = $(this);
			if (obj.children().hasClass('tumblr_video_container')) {
				obj.children().removeAttr("style");
				obj.find("iframe").each(function () {
					var a = $(this).attr("data-width");
					var b = $(this).attr("data-height");
					var c = ((b / a) * 100) + "%";
					$(this).parent().parent().css({
						"padding-bottom": c
					})
				})
			} else {
				obj.children("iframe").each(function () {
					var d = $(this).attr("width");
					var e = $(this).attr("height");
					var f = ((e / d) * 100) + "%";
					obj.css({
						"padding-bottom": f
					})
				})
			}
		})
	}
})(jQuery);

$(function () {
	$(".video").fluidVids();
	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
		$('#sidebar').css({'background': '#D34836'});
	}
});

$("body").on({
    ajaxStart: function() { 
        $(this).addClass("loading"); 
    },
    ajaxStop: function() { 
        $(this).removeClass("loading"); 
    }    
});