/*! Lightbox script by Gabrielle Wee */
const lightbox = (buttons, boxes) => {
	let scrollPosition = document.documentElement.scrollTop;

	const deactivate = (lightboxes) => {
		lightboxes.forEach(lightbox => {
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
		});
	}

	const activate = (e, lightboxes, index, contents) => {
		e.preventDefault();
		lightboxes[index].classList.add("active");
		lightboxes[index].focus();
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

	const removeLightbox = (links, lightbox, index, contents) => {
		contents.push(lightbox);
		contents.forEach(content=>{
			content.classList.remove("active");
		});
		links[index].focus();
	}

	const setNext = (e, sibling, lightbox, lightboxes, index, contents) => {
		setTimeout(() => {
			contents.push(lightbox);
			contents.forEach(content=>{
				content.classList.remove("active");
			});
			if(e.key === "ArrowRight") {
				sibling = lightboxes[index + 1] || lightboxes[0];
			} else if(e.key === "ArrowLeft") {
				sibling = lightboxes[index - 1] || lightboxes[lightboxes.length - 1];
			}
			sibling.focus();
			let siblingContents;
			if(sibling.nextElementSibling.hasAttribute("data-content")) {
				siblingContents = [sibling.nextElementSibling];
			} else {
				siblingContents = Array.from(sibling.querySelectorAll("[data-content]"))
			}
			siblingContents.push(sibling);
			siblingContents.forEach(content=>{
				content.classList.add("active");
				let frame = content.querySelector("iframe");
				if(frame) frame.src = frame.src;
			});
		}, 100);
	}

	const shortcut = (e, sibling, links, lightbox, lightboxes, index, contents) => {
		if(lightbox.classList.contains("active")) {
			if (e.key === "Escape") {
				removeLightbox(links, lightbox, index, contents);
			} else if(e.key === "ArrowRight" || e.key === "ArrowLeft") {
				setNext(e, sibling, lightbox, lightboxes, index, contents);
			}
		}
	}

	let controller;
	const expand = (links, lightboxes) => {
		controller = new AbortController();
		let { signal } = controller;

		links.forEach((link, index)=>{
			let contents;
			if(lightboxes[index].nextElementSibling.hasAttribute("data-content")) {
				contents = [lightboxes[index].nextElementSibling];
			} else {
				contents = Array.from(lightboxes[index].querySelectorAll("[data-content]"))
			}
			link.addEventListener("click", e => activate(e, lightboxes, index, contents), { signal });
		});

		let sibling;
		lightboxes.forEach((lightbox, index)=>{
			let contents;
			if(lightbox.nextElementSibling.hasAttribute("data-content")) {
				contents = [lightbox.nextElementSibling];
			} else {
				contents = Array.from(lightbox.querySelectorAll("[data-content]"))
			}
			lightbox.addEventListener("click", e => {
				e.preventDefault();
				removeLightbox(links, lightbox, index, contents);
			}, { signal });
			document.addEventListener("keydown", e => shortcut(e, sibling, links, lightbox, lightboxes, index, contents), { signal });
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

		return () => {
			lightboxes.forEach((lightbox, index)=>{
				let contents;
				if(lightboxes[index].nextElementSibling.hasAttribute("data-content")) {
					contents = [lightboxes[index].nextElementSibling];
				} else {
					contents = Array.from(lightboxes[index].querySelectorAll("[data-content]"))
				}
				removeLightbox(links, lightbox, index, contents);
			});
			controller.abort();
		}
	});
}