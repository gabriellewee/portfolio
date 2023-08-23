/*! Lightbox script by Gabrielle Wee */
const lightbox = (buttons) => {
	let links = Array.from(document.querySelectorAll(buttons))
	let lightboxes = Array.from(document.querySelectorAll(".lightbox"));
	if(!links || !lightboxes) return;
	let scrollPosition;

	links.forEach((link, index)=>{
		let backgrounds = Array.from(lightboxes[index].querySelectorAll(".image"));
		let deactivate = () => {
			if(lightboxes[index].classList.contains("active")) {
				lightboxes[index].classList.remove("active");
				backgrounds.forEach(background=>{
					background.classList.remove("active");
				});
				scrollPosition = document.documentElement.scrollTop;
			}
		}
		link.addEventListener("click", e => {
			e.preventDefault();
			lightboxes[index].classList.add("active");
			lightboxes[index].focus();
			scrollPosition = document.documentElement.scrollTop;
			backgrounds.forEach(background=>{
				imagesLoaded(background, () => {
					background.classList.add("active");
				});
			});
			ScrollTrigger.create({
				trigger: document.body,
				start: `${scrollPosition}`,
				end: `${scrollPosition + 320}`,
				once: true,
				onLeave: () => deactivate()
			});
			ScrollTrigger.create({
				trigger: document.body,
				start: `${scrollPosition - 320}`,
				end: `${scrollPosition}`,
				once: true,
				onLeaveBack: () => deactivate()
			});
		});
	});

	let removeLightbox = (lightbox, index, backgrounds) => {
		backgrounds.push(lightbox);
		backgrounds.forEach(background=>{
			background.classList.remove("active");
		});
		links[index].focus();
	}

	let sibling;
	lightboxes.forEach((lightbox, index)=>{
		let backgrounds = Array.from(lightbox.querySelectorAll(".image"));
		lightbox.addEventListener("click", e => {
			e.preventDefault();
			removeLightbox(lightbox, index, backgrounds);
		});
		document.addEventListener("keydown", e => {
			if(lightbox.classList.contains("active")) {
				if (e.key === "Escape") {
					removeLightbox(lightbox, index, backgrounds);
				} else if(e.key === "ArrowRight" || e.key === "ArrowLeft") {
					setTimeout(() => {
						backgrounds.push(lightbox);
						backgrounds.forEach(background=>{
							background.classList.remove("active");
						});
						if(e.key === "ArrowRight") {
							sibling = lightboxes[index + 1] || lightboxes[0];
						} else if(e.key === "ArrowLeft") {
							sibling = lightboxes[index - 1] || lightboxes[lightboxes.length - 1];
						}
						let siblingBackgrounds = Array.from(sibling.querySelectorAll(".image"));
						siblingBackgrounds.push(sibling);
						siblingBackgrounds.forEach(background=>{
							background.classList.add("active");
						});
					}, 100);
				}
			}
		});
	});
}