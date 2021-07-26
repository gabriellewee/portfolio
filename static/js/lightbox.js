const lightbox = ((links = Array.from(document.querySelectorAll(".expand"))) => {
	let lightboxes = Array.from(document.querySelectorAll(".lightbox"))
	let sibling;
	if(links && lightboxes) {
		links.forEach((link, index)=>{
			let background = lightboxes[index].querySelector("span");
			link.addEventListener("click", e => {
				e.preventDefault();
				lightboxes[index].classList.add("active");
				imagesLoaded(background, { background: true }, () => {
					background.classList.add("active");
				});
			});
		});
		lightboxes.forEach((lightbox, index)=>{
			lightbox.addEventListener("click", e => {
				e.preventDefault();
				lightbox.classList.remove("active");
				lightbox.querySelector("span").classList.remove("active");
			});
			document.addEventListener("scroll", e => {
				if(lightbox.classList.contains("active")) {
					setTimeout(() => {
						lightbox.classList.remove("active");
						lightbox.querySelector("span").classList.remove("active");
					}, 300);
				}
			});
			document.addEventListener("keydown", e => {
				let keycode = e.keyCode;
				if(lightbox.classList.contains("active")) {
					if (keycode === 27) {
						lightbox.classList.remove("active");
						lightbox.querySelector("span").classList.remove("active");
					} else if(keycode === 39 || keycode === 37) {
						setTimeout(() => {
							lightbox.classList.remove("active");
							lightbox.querySelector("span").classList.remove("active");
							if(keycode === 39) {
								sibling = lightboxes[index + 1] || lightboxes[0];
							} else if(keycode === 37) {
								sibling = lightboxes[index - 1] || lightboxes[lightboxes.length - 1];
							}
							sibling.classList.add("active");
							sibling.querySelector("span").classList.add("active");
						}, 100);
					}
				}
			});
		});
	}
})();