import { waitForGlobals } from '../helpers/domHelpers.js';

// Lightbox
export const lightbox = ({
	buttonSelector = "[data-media-expand]",
	boxSelector = "[data-lightbox]",
	scroll
} = {}) => {
	const $html = document.documentElement;
	let scrollPosition = $html.scrollTop;
	let controller;

	const getSiblings = (selector, isDesktop) =>
		[...document.querySelectorAll(isDesktop ? selector : `${selector}:not([data-desktop])`)];

	const closeDialog = (e, lightbox) => {
		const content = lightbox.nextElementSibling;
		if (!e.target.contains(content)) return;
		deactivate(lightbox);
	};

	const deactivate = (targets) => {
		const remove = (el) => {
			const content = el.nextElementSibling;
			if (el.classList.contains("active")) {
				el.classList.remove("active");
				content.classList.remove("active");
				content.setAttribute("inert", true);
				setTimeout(() => content.close(), 200);
			}
		};
		(Array.isArray(targets) ? targets : [targets]).forEach(remove);
	};

	const activate = (lightbox) => {
		const content = lightbox.nextElementSibling;
		const frame = content.querySelector("iframe");
		if (frame) frame.src = frame.src;

		lightbox.classList.add("active");
		scrollPosition = $html.scrollTop;

		imagesLoaded(content, () => {
			content.showModal();
			content.classList.add("active");
			content.removeAttribute("inert");
			setTimeout(() => (content.inert = false), 200);
		});

		ScrollTrigger.create({
			trigger: document.body,
			start: `${scrollPosition - 240}`,
			end: `${scrollPosition + 240}`,
			once: true,
			invalidateOnRefresh: true,
			onLeave: () => deactivate(lightbox),
			onLeaveBack: () => deactivate(lightbox),
		});

		document.addEventListener("click", (e) => closeDialog(e, lightbox), { passive: true });
	};

	const scrollToTarget = (lightbox) => {
		const id = lightbox.getAttribute("href").slice(1);
		const info = document.getElementById(`${id}-info`);
		const element = document.getElementById(id);
		const expand = element?.querySelector("[data-media-expand]");

		if (info) {
			info.scrollIntoView({ behavior: "smooth" });
			info.focus();
			if (!info.checked) info.click();
		} else if (element) {
			element.scrollIntoView({ behavior: "smooth" });
			(expand || element).focus();
		}
	};

	const handleShortcut = (e, current, lightboxes, index) => {
		if (!current.classList.contains("active")) return;

		if (e.key === "Escape") {
			deactivate(current);
			scrollToTarget(current);
		} else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
			setTimeout(() => {
				deactivate(current);
				const next = e.key === "ArrowRight"
					? lightboxes[index + 1] || lightboxes[0]
					: lightboxes[index - 1] || lightboxes[lightboxes.length - 1];
				activate(next);
			}, 100);
		}
	};

	const bindLightboxes = (buttons, lightboxes) => {
		controller = new AbortController();
		const { signal } = controller;

		buttons.forEach((btn, i) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				activate(lightboxes[i]);
			}, { signal });
		});

		lightboxes.forEach((box, i) => {
			const content = box.nextElementSibling;
			const isImage = content.classList.contains("image");

			box.addEventListener("click", (e) => {
				e.preventDefault();
				deactivate(box);
			}, { signal });

			if (isImage) {
				content.addEventListener("click", (e) => {
					e.preventDefault();
					deactivate(box);
				}, { signal });
			}

			document.addEventListener("keydown", (e) => {
				handleShortcut(e, box, lightboxes, i);
			}, { signal });
		});
	};


	waitForGlobals(["gsap"], (gsap) => {
		const breakpoint = 768;
		const mm = gsap.matchMedia();
		mm.add(
			{
				desktop: `(min-width: ${breakpoint}px)`,
				mobile: `(max-width: ${breakpoint - 1}px)`,
			},
			(context) => {
				const isDesktop = context.conditions.desktop;
				let buttons = getSiblings(buttonSelector, isDesktop);
				let boxes = getSiblings(boxSelector, isDesktop);

				bindLightboxes(buttons, boxes);

				if (scroll?.on) {
					scroll.on("append", () => {
						deactivate(boxes);
						controller.abort();
						buttons = getSiblings(buttonSelector, isDesktop);
						boxes = getSiblings(boxSelector, isDesktop);
						bindLightboxes(buttons, boxes);
					});
				}

				return () => {
					deactivate(boxes);
					controller.abort();
				};
			}
		);
	});
};