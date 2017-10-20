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
	$(".uguru-animation-player").click(function(){
		$(this).addClass("play");
	});
});
