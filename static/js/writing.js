const smoothScrollLinks = ((links = Array.from(document.querySelectorAll(".direct-link"))) => {
	let mainContent = document.querySelector("main");
	links.forEach(el=>{
		let targetLink = el.getAttribute("href");
		el.addEventListener("click", e => {
			document.getElementById(targetLink).scrollIntoView({ behavior: "smooth" });
		});
	});
	if(window.location.hash) {
		let scrollLocation = document.querySelector(window.location.hash);
		if(scrollLocation) {
			imagesLoaded(mainContent, { background: true }, () =>{
				setTimeout(() => {
					scrollLocation.scrollIntoView({ behavior: "smooth" });
				}, 300);
			});
		}
	}
})();

const targetBlankLinks = ((links = document.getElementsByTagName("a")) => {
	for (var i = 0; i < links.length; i++) {
		if (/^(https?:)?\/\//.test(links[i].getAttribute("href"))) {
			links[i].target = "_blank";
		}
	}
})();