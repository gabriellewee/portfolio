import { waitForGlobals } from "../helpers/domHelpers.js";
import { scrollToTarget } from '../helpers/scrollToHelpers.js';

// Lightbox
export const lightbox = ({
	buttonSelector = "[data-media-expand]",
	boxSelector = "[data-lightbox]",
	scroll
} = {}) => {
	const $html = document.documentElement;
	let scrollPosition = $html.scrollTop;
	let controller;
	let openingButton;
	let openingLightbox;

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

	const getSiblings = (selector, isDesktop) =>
		[...document.querySelectorAll(isDesktop ? selector : `${selector}:not([data-desktop])`)];

	const getTargetId = (lightbox) =>
		lightbox.getAttribute("href")?.slice(1);

	const getTargetElements = (lightbox) => {
		const id = getTargetId(lightbox);

		if (!id) return { id: null, info: null, element: null, expand: null };

		const info = document.getElementById(`${id}-info`);
		const element = document.getElementById(id);
		const expand = element?.querySelector("[data-media-expand]");

		return { id, info, element, expand };
	};

	const activateOverlay = (lightbox) => {
		const { info, element, expand } = getTargetElements(lightbox);

		if (info) {
			info.open = true;

			requestAnimationFrame(() => {
				info.querySelector("summary")?.focus({
					preventScroll: true
				});
			});
		} else if (element) {
			requestAnimationFrame(() => {
				(expand || element).focus({
					preventScroll: true
				});
			});
		}
	};

	const deactivate = (targets, callback) => {
		const remove = (lightbox) => {
			const content = lightbox?.nextElementSibling;
			if (!content || !lightbox.classList.contains("active")) return;

			lightbox.classList.remove("active");
			lightbox.setAttribute("aria-hidden", "true");
			content.classList.remove("active");
			content.setAttribute("inert", "");

			setTimeout(() => {
				if (content.open) content.close();
				callback?.(lightbox);
			}, 200);
		};

		const targetList = Array.isArray(targets) ? targets : [targets];
		targetList.forEach(remove);
	};

	const deactivateAndRestore = (lightbox) => {
		deactivate(lightbox, () => {
			if (lightbox === openingLightbox && openingButton) {
				openingButton.focus({ preventScroll: true });
			} else {
				const { info, element } = getTargetElements(lightbox);
				const target = info || element;

				if (target) scrollToTarget(target);
				activateOverlay(lightbox);
			}

			openingButton = null;
			openingLightbox = null;
		});
	};

	const activate = (lightbox) => {
		const content = lightbox.nextElementSibling;
		const frame = content?.querySelector("iframe");

		if (!content) return;

		if (frame) frame.src = frame.src;

		lightbox.removeAttribute("aria-hidden");
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
			onLeaveBack: () => deactivate(lightbox)
		});
	};

	const handleShortcut = (e, current, lightboxes, index) => {
		if (!current.classList.contains("active")) return;

		if (e.key === "Escape") {
			e.preventDefault();
			deactivateAndRestore(current);
			return;
		}

		if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;

		e.preventDefault();

		setTimeout(() => {
			deactivate(current);
			const next =
				e.key === "ArrowRight"
					? lightboxes[index + 1] || lightboxes[0]
					: lightboxes[index - 1] || lightboxes[lightboxes.length - 1];
			activate(next);
		}, 100);
	};

	const bindLightboxes = (buttons, lightboxes) => {
		controller = new AbortController();
		const { signal } = controller;

		buttons.forEach((button, index) => {
			button.addEventListener("click", (e) => {
				e.preventDefault();

				const selectedLightbox = lightboxes[index];
				if (!selectedLightbox) return;

				openingButton = button;
				openingLightbox = selectedLightbox;

				activate(selectedLightbox);
			}, { signal });
		});

		lightboxes.forEach((box, index) => {
			const content = box.nextElementSibling;
			if (!content) return;
			box.setAttribute("aria-hidden", "true");

			box.addEventListener("click", (e) => {
				e.preventDefault();
				deactivateAndRestore(box);
			}, { signal });

			content.addEventListener("click", (e) => {
				if (e.target !== content) return;
				e.preventDefault();
				deactivateAndRestore(box);
			}, { signal });

			content.addEventListener("cancel", (e) => {
				e.preventDefault();
				deactivateAndRestore(box);
			}, { signal });

			document.addEventListener("keydown", (e) => {
				handleShortcut(e, box, lightboxes, index);
			}, { signal });
		});
	};

	waitForGlobals(["gsap"], (gsap) => {
		const breakpoint = 768;
		const mm = gsap.matchMedia();

		mm.add({
			desktop: `(min-width: ${breakpoint}px)`,
			mobile: `(max-width: ${breakpoint - 1}px)`
		}, (context) => {
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
		});
	});
};