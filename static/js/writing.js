const noJS = (() => {
	document.documentElement.classList.remove("no-js");
	document.documentElement.classList.add("js");
})();

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
	if(window.location.hash) {
		let scrollHash = window.location.hash.substring(1);
		let scrollLocation = document.getElementById(scrollHash);
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

const animationPlayPause = ((animations = Array.from(document.querySelectorAll(".animation"))) => {
	animations.forEach(animation=>{
		let play = animation.querySelector(".play");
		let pause = animation.querySelector(".pause");
		let elements = animation.querySelectorAll(".animating");
		play.addEventListener("click", e => {
			elements.forEach(el=>{
				el.style.animationPlayState = "running";
				play.style.display = "none";
				pause.style.display = "block";
			});
		});
		play.addEventListener("keydown", e => {
			if (e.key === "Enter") {
				setTimeout(() => {
					pause.focus();
				}, 50);
			}
		});
		pause.addEventListener("click", e => {
			elements.forEach(el=>{
				el.style.animationPlayState = "paused";
				play.style.display = "block";
				pause.style.display = "none";
			});
		});
		pause.addEventListener("keydown", e => {
			if (e.key === "Enter") {
				setTimeout(() => {
					play.focus();
				}, 50);
			}
		});
	});
})();