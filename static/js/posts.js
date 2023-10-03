lightbox(".expand", ".lightbox");
timeAgo("time");

const smoothScrollLinks = ((links = Array.from(document.querySelectorAll(".direct-link"))) => {
	let mainContent = document.querySelector("main");
	links.forEach(link=>{
		link.setAttribute("aria-hidden", "true");
		let linkHref = link.getAttribute("href").substring(1);
		let targetLink = document.getElementById(linkHref);
		link.addEventListener("click", e => {
			targetLink.scrollIntoView({ behavior: "smooth" });
		});
	});
	if (window.location.hash) {
		let scrollHash = window.location.hash.substring(1);
		let scrollLocation = document.getElementById(scrollHash);
		if (scrollLocation) {
			imagesLoaded(mainContent, { background: true }, () =>{
				setTimeout(() => {
					scrollLocation.scrollIntoView({ behavior: "smooth" });
				}, 300);
			});
		}
	}
})();