/*! Lightbox script by Gabrielle Wee */
const lightbox = (buttons, boxes, scroll) => {
	if (!buttons || !boxes) return;

	let scrollPosition = document.documentElement.scrollTop;

	const closeDialog = (e, lightbox) => {
		let content = lightbox.nextElementSibling;
		if (!e.target.contains(content)) return;
		deactivate(lightbox);
	}

	const deactivate = (lightboxes) => {
		const remove = (lightbox) => {
			let content = lightbox.nextElementSibling;
			if (lightbox.classList.contains("active")) {
				lightbox.classList.remove("active");
				content.classList.remove("active");
				setTimeout(() => {
					content.close();
				}, 200);
				content.setAttribute("inert", true);
				scrollPosition = document.documentElement.scrollTop;
				document.removeEventListener('click', e => {
					closeDialog(e, lightbox);
				}, { passive: true });
			}
		}
		if (lightboxes instanceof Array) {
			lightboxes.forEach(lightbox => {
				remove(lightbox);
			});
		} else {
			remove(lightboxes);
		}
	}

	const activate = (lightbox) => {
		let content = lightbox.nextElementSibling;
		let frame = content.querySelector("iframe");
		if (frame) frame.src = frame.src;

		lightbox.classList.add("active");
		scrollPosition = document.documentElement.scrollTop;

		imagesLoaded(content, () => {
			content.showModal();
			content.classList.add("active");
			content.setAttribute("inert", false);
			setTimeout(() => {
				content.inert = false;
			}, 200);
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

		document.addEventListener('click', e => {
			closeDialog(e, lightbox);
		}, { passive: true });
	}

	const shortcut = (e, lightbox, lightboxes, index) => {
		if (lightbox.classList.contains("active")) {
			if (e.key === "Escape") {
				deactivate(lightbox);
				scrollTo(lightbox);
			} else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
				setTimeout(() => {
					let ctrl = false;
					if (e.key === "Ctrl") {
						ctrl = true;
					}
					deactivate(lightbox);
					if (lightboxes.length > 1) {
						let sibling;
						if (e.key === "ArrowRight" && !ctrl) {
							sibling = lightboxes[index + 1] || lightboxes[0];
						} else if (e.key === "ArrowLeft" && !ctrl) {
							sibling = lightboxes[index - 1] || lightboxes[lightboxes.length - 1];
						}
						activate(sibling);
					}
				}, 100);
			}
		}
	}

	const scrollTo = (lightbox) => {
		let href = lightbox.getAttribute("href").slice(1);
		let info = document.querySelector(`[id="${href}-info"]`);
		let element = document.querySelector(`[id="${href}"]`);
		let expand = element.querySelector("[data-media-expand]");
		if (info) {
			info.scrollIntoView({ behavior: "smooth" });
			info.focus();
			if (!info.checked) {
				info.click();
			}

		} else if (element) {
			element.scrollIntoView({ behavior: "smooth" });
			expand ? expand.focus() : element.focus();
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
				scrollTo(lightbox);
			}, { signal });

			let content = lightbox.nextElementSibling;
			if (content.classList.contains("image")) {
				content.addEventListener("click", e => {
					e.preventDefault();
					deactivate(lightbox);
					scrollTo(lightbox);
				}, { signal });
			}

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

		if (scroll) {
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