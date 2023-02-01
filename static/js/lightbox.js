/*! Lightbox script by Gabrielle Wee */
const lightbox = (buttons) => {
	let links = Array.from(document.querySelectorAll(buttons))
	let lightboxes = Array.from(document.querySelectorAll(".lightbox"));
	let sibling;
	if(!links && !lightboxes) return;
	links.forEach((link, index)=>{
		let backgrounds = Array.from(lightboxes[index].querySelectorAll(".image"));
		link.addEventListener("click", e => {
			e.preventDefault();
			lightboxes[index].classList.add("active");
			lightboxes[index].focus();
			backgrounds.forEach(background=>{
				imagesLoaded(background, () => {
					background.classList.add("active");
				});
			});
		});
	});
	lightboxes.forEach((lightbox, index)=>{
		let backgrounds = Array.from(lightbox.querySelectorAll(".image"));
		lightbox.addEventListener("click", e => {
			e.preventDefault();
			lightbox.classList.remove("active");
			links[index].focus();
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
			if(lightbox.classList.contains("active")) {
				if (e.key === "Escape") {
					lightbox.classList.remove("active");
					links[index].focus();
					backgrounds.forEach(background=>{
						background.classList.remove("active");
					});
				} else if(e.key === "ArrowRight" || e.key === "ArrowLeft") {
					setTimeout(() => {
						lightbox.classList.remove("active");
						backgrounds.forEach(background=>{
							background.classList.remove("active");
						});
						if(e.key === "ArrowRight") {
							sibling = lightboxes[index + 1] || lightboxes[0];
						} else if(e.key === "ArrowLeft") {
							sibling = lightboxes[index - 1] || lightboxes[lightboxes.length - 1];
						}
						let siblingBackgrounds = Array.from(sibling.querySelectorAll(".image"));
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