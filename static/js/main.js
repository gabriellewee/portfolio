import { showAllHidden, refreshIframes, enableClipboardButtons, targetBlankLinks, waitForGlobals } from './helpers/domHelpers.js';
import { timeAgo, durationFormat } from './helpers/timeHelpers.js';

import { accessibility } from './components/accessibility.js';
import { lightbox } from './components/lightbox.js';
import { mediaInfoToggle } from './components/mediaInfoToggle.js';
import { popup } from './components/popup.js';

// Call scripts
showAllHidden();

popup();
accessibility();
enableClipboardButtons();

// Recall for infinite scroll
durationFormat();
mediaInfoToggle();
refreshIframes();
targetBlankLinks();
timeAgo();

const container = document.querySelector("[data-grid]");
if (container) {
	waitForGlobals(["Isotope"], (Isotope) => {
		// Masonry/Packery layout
		const motionClass = document.documentElement.classList.contains("theme-reduce-motion");
		const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

		const layout = (grid) => {
			grid.setAttribute("data-grid", "true");
			const config = {
				percentPosition: true,
				layoutMode: "packery",
				itemSelector: "[data-grid-item]",
				packery: { gutter: 24 },
			};

			if (!motionClass && motionOK) {
				window.iso = new Isotope(grid, config);
			} else {
				window.iso = new Isotope(grid, {
					...config,
					hiddenStyle: { opacity: 0 },
					visibleStyle: { opacity: 1 },
				});
			}
		};
		if (container && document.body.classList.contains("page-filters")) layout(container);

		waitForGlobals(["gsap", "ScrollTrigger"], (gsap, ScrollTrigger) => {
			gsap.registerPlugin(ScrollTrigger);
			const gmm = gsap.matchMedia();
			gmm.add("(min-width: 568px) and (max-height: 450px), (min-width: 768px)", () => {
				if (container && !window.iso && !document.body.classList.contains("page-filters")) {
					layout(container);
				}
			});
		});

		// Infinite scroll
		const scrollContainer = document.querySelector("[data-scroll]");
		const lightboxContainer = document.querySelector("[data-lightbox-container]");
		if (scrollContainer && lightboxContainer) {
			waitForGlobals(["InfiniteScroll", "Isotope"], (InfiniteScroll, Isotope) => {
				const scroll = new InfiniteScroll(scrollContainer, {
					button: '[data-load]',
					path: '[data-load-path]',
					append: '[data-post-append]',
					scrollThreshold: false,
					outlayer: iso,
					status: '.page-load-status'
				});

				const lightboxScroll = new InfiniteScroll(lightboxContainer, {
					button: '[data-load]',
					path: '[data-load-path]',
					append: '[data-lightbox-append]',
					scrollThreshold: false,
					history: false
				});

				lightbox({scroll: scroll});

				scroll.on("append", () => {
					durationFormat();
					mediaInfoToggle();
					refreshIframes();
					targetBlankLinks();
					timeAgo();
				});
			});
		} else if (lightboxContainer) {
			lightbox();
		}

		// Relayout on image load
		waitForGlobals(["imagesLoaded", "Isotope"], (ImagesLoaded, Isotope) => {
			new imagesLoaded(document.body, () => {
				if (container && iso) {
					iso.layout();
				}
				document.documentElement.classList.add("loaded");
			});
		});
	});
}