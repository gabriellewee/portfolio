/*! Lightbox script by Gabrielle Wee */
const lightbox = (buttons, boxes, scroll) => {
	if(!buttons || !boxes) return;

	let scrollPosition = document.documentElement.scrollTop;

	const deactivate = (lightboxes) => {
		const remove = (lightbox) => {
			let contents;
			if(lightbox.nextElementSibling.hasAttribute("data-content")) {
				contents = [lightbox.nextElementSibling];
			} else {
				contents = Array.from(lightbox.querySelectorAll("[data-content]"))
			}
			if(lightbox.classList.contains("active")) {
				lightbox.classList.remove("active");
				contents.forEach(content=>{
					content.classList.remove("active");
				});
				scrollPosition = document.documentElement.scrollTop;
			}
		}
		if(lightboxes instanceof Array) {
			lightboxes.forEach(lightbox => {
				remove(lightbox);
			});
		} else {
			remove(lightboxes);
		}
	}

	const activate = (lightbox) => {
		let contents;
		if(lightbox.nextElementSibling.hasAttribute("data-content")) {
			contents = [lightbox.nextElementSibling];
		} else {
			contents = Array.from(lightbox.querySelectorAll("[data-content]"))
		}

		lightbox.classList.add("active");
		lightbox.focus();
		scrollPosition = document.documentElement.scrollTop;

		contents.forEach(content=>{
			let frame = content.querySelector("iframe");
			imagesLoaded(content, () => {
				content.classList.add("active");
				if(frame) frame.src = frame.src;
			});
		});

		const scrollOut = ScrollTrigger.create({
			trigger: document.body,
			start: `${scrollPosition - 240}`,
			end: `${scrollPosition + 240}`,
			once: true,
			onLeave: () => deactivate(lightboxes),
			onLeaveBack: () => deactivate(lightboxes),
			invalidateOnRefresh: true,
		});
	}

	const setNext = (e, lightbox, lightboxes, index) => {
		setTimeout(() => {
			deactivate(lightbox);
			if(lightboxes.length > 1) {
				let sibling;
				if(e.key === "ArrowRight") {
					sibling = lightboxes[index + 1] || lightboxes[0];
				} else if(e.key === "ArrowLeft") {
					sibling = lightboxes[index - 1] || lightboxes[lightboxes.length - 1];
				}
				sibling.focus();
				activate(sibling);
			}
		}, 100);
	}

	const shortcut = (e, lightbox, lightboxes, index) => {
		if(lightbox.classList.contains("active")) {
			if (e.key === "Escape") {
				deactivate(lightbox);
			} else if(e.key === "ArrowRight" || e.key === "ArrowLeft") {
				setNext(e, lightbox, lightboxes, index);
			}
		}
	}

	let controller;
	const expand = (links, lightboxes) => {
		controller = new AbortController();
		let { signal } = controller;

		links.forEach((link, index)=>{
			link.addEventListener("click", e => {
				e.preventDefault();
				activate(lightboxes[index]);
			}, { signal });
		});

		lightboxes.forEach((lightbox, index)=>{
			lightbox.addEventListener("click", e => {
				e.preventDefault();
				deactivate(lightbox);
				links[index].focus();
			}, { signal });

			document.addEventListener("keydown", e => {
				shortcut(e, lightbox, lightboxes, index);
			}, { signal });
		});
	}

	let mm = gsap.matchMedia(), breakpoint = 768;
	mm.add({
		desktop: `(min-width: ${breakpoint}px)`,
		mobile: `(max-width: ${breakpoint - 1}px)`
	}, (context) => {
		let { desktop, mobile } = context.conditions;

		links = desktop ? [... document.querySelectorAll(`${buttons}`)] : [... document.querySelectorAll(`${buttons}:not([data-desktop])`)];
		lightboxes = desktop ? [... document.querySelectorAll(`${boxes}`)] : [... document.querySelectorAll(`${boxes}:not([data-desktop])`)];

		expand(links, lightboxes);

		if(scroll) {
			scroll.on('append', (body, path, items, response) => {
				deactivate(lightboxes);
				controller.abort();

				links = desktop ? [... document.querySelectorAll(`${buttons}`)] : [... document.querySelectorAll(`${buttons}:not([data-desktop])`)];
				lightboxes = desktop ? [... document.querySelectorAll(`${boxes}`)] : [... document.querySelectorAll(`${boxes}:not([data-desktop])`)];

				expand(links, lightboxes);
			});
		}

		return () => {
			deactivate(lightboxes);
			controller.abort();
		}
	});
}