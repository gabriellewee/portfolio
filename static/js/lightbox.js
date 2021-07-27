const lightbox = ((links = Array.from(document.querySelectorAll(".expand"))) => {
	let lightboxes = Array.from(document.querySelectorAll(".lightbox"))
	let sibling;
	if(links && lightboxes) {
		links.forEach((link, index)=>{
			let backgrounds = Array.from(lightboxes[index].querySelectorAll("span"));
			link.addEventListener("click", e => {
				e.preventDefault();
				lightboxes[index].classList.add("active");
				backgrounds.forEach(background=>{
					imagesLoaded(background, { background: true }, () => {
						background.classList.add("active");
					});
				});
			});
		});
		lightboxes.forEach((lightbox, index)=>{
			let backgrounds = Array.from(lightbox.querySelectorAll("span"));
			lightbox.addEventListener("click", e => {
				e.preventDefault();
				lightbox.classList.remove("active");
				backgrounds.forEach(background=>{
					background.classList.remove("active");
				});
			});
			document.addEventListener("scroll", e => {
				if(lightbox.classList.contains("active")) {
					setTimeout(() => {
						lightbox.classList.remove("active");
						backgrounds.forEach(background=>{
							background.classList.remove("active");
						});
					}, 300);
				}
			});
			document.addEventListener("keydown", e => {
				let keycode = e.keyCode;
				if(lightbox.classList.contains("active")) {
					if (keycode === 27) {
						lightbox.classList.remove("active");
						backgrounds.forEach(background=>{
							background.classList.classList.remove("active");
						});
					} else if(keycode === 39 || keycode === 37) {
						setTimeout(() => {
							lightbox.classList.remove("active");
							backgrounds.forEach(background=>{
								background.classList.remove("active");
							});
							if(keycode === 39) {
								sibling = lightboxes[index + 1] || lightboxes[0];
							} else if(keycode === 37) {
								sibling = lightboxes[index - 1] || lightboxes[lightboxes.length - 1];
							}
							let siblingBackgrounds = Array.from(sibling.querySelectorAll("span"));
							sibling.classList.add("active");
							siblingBackgrounds.forEach(background=>{
								background.classList.add("active");
							});
						}, 100);
					}
				}
			});
		});
	}
})();