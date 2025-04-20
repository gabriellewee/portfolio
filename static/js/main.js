// Refresh iframes
const frames = (buttons) => {
	document.querySelectorAll(buttons).forEach((button) => {
		const frame = button.closest("figure, div")?.querySelector("iframe");
		if (!frame) return;

		const refresh = () => (frame.src = frame.src);

		button.addEventListener("click", refresh);
		button.addEventListener("keydown", (e) => {
			if (e.key === "Enter") refresh();
		});
	});
};

// "View more" info popups for media
const mediaTriggers = (media) => {
	const figures = document.querySelectorAll(media);
	if (!figures.length) return;

	figures.forEach((figure) => {
		const trigger = figure.querySelector("[data-media-trigger]");
		const data = figure.querySelector("[data-media-info]");
		const expand = figure.querySelector("[data-media-expand]");
		const external = figure.querySelectorAll("[data-media-external]");
		const labels = figure.querySelectorAll("[data-media-label]");

		if (!trigger || !data || !expand) return;

		const name = trigger.id.replace(/-info$/, "");

		data.setAttribute("aria-hidden", "true");

		const setState = (on) => {
			trigger.setAttribute("aria-checked", on ? "true" : "false");
			data.setAttribute("aria-hidden", on ? "false" : "true");
			expand.tabIndex = on ? 0 : -1;
			external.forEach((el) => (el.tabIndex = on ? 0 : -1));
		};

		trigger.addEventListener("focus", () => {
			document.getElementById(name)?.scrollIntoView({ behavior: "smooth" });
		});

		trigger.addEventListener("click", () => {
			setState(trigger.checked);
		});

		trigger.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				trigger.checked = !trigger.checked;
				setState(trigger.checked);
			}
		});

		labels.forEach((label) => {
			label.addEventListener("click", () => {
				setState(trigger.checked);
			});
		});
	});
};

// Copy text
(() => {
	const buttons = document.querySelectorAll("[data-clip]");
	if (!buttons.length || !navigator.clipboard) return;

	buttons.forEach((button) => {
		button.removeAttribute("disabled");
		let text = button.getAttribute("data-clip");
		let target = text;

		if (/^[^a-zA-Z0-9]/.test(text)) {
			const el = document.querySelector(text);
			if (!el) return;
			text = el.value || el.textContent || "";
			target = el;
		}

		const toggleVisibility = (show) => {
			if (button.hasAttribute("data-clip-target") && target instanceof HTMLElement) {
				target.classList.toggle("hidden", !show);
			} else if (button instanceof HTMLInputElement) {
				const parent = button.parentNode;
				parent.classList.toggle("hidden", !show);
				if (show) button.select();
			} else {
				button.classList.toggle("hidden", !show);
			}
		};

		button.addEventListener("click", async (e) => {
			e.preventDefault();
			await navigator.clipboard.writeText(text);

			toggleVisibility(true);
			setTimeout(() => toggleVisibility(false), 3000);
		});
	});
})();

// Open external links in new tab
const targetBlankLinks = (links = document.querySelectorAll("a")) => {
	links.forEach((anchor) => {
		const href = anchor.getAttribute("href");
		if (/^(https?:)?\/\//.test(href)) {
			anchor.target = "_blank";
			anchor.rel = "noopener noreferrer";
		}
	});
};

// Call scripts
frames("[data-reload]");
timeAgo("[data-time]");
durationFormat("[data-duration]");
mediaTriggers("[data-media-container]");
targetBlankLinks();

// Masonry/Packery layout
const container = document.querySelector("[data-grid]");
const motionClass = document.documentElement.classList.contains("theme-reduce-motion");
const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
let iso;

const layout = (grid) => {
	grid.setAttribute("data-grid", "true");
	const config = {
		percentPosition: true,
		layoutMode: "packery",
		itemSelector: "[data-grid-item]",
		packery: { gutter: 24 },
	};

	if (!motionClass && motionOK) {
		iso = new Isotope(grid, config);
	} else {
		iso = new Isotope(grid, {
			...config,
			hiddenStyle: { opacity: 0 },
			visibleStyle: { opacity: 1 },
		});
	}
};

if (container && document.body.classList.contains("page-filters")) layout(container);

const gmm = gsap.matchMedia();
gmm.add("(min-width: 568px) and (max-height: 450px), (min-width: 768px)", () => {
	if (container && !iso && !document.body.classList.contains("page-filters")) {
		layout(container);
	}
});

// Infinite scroll
const scrollContainer = document.querySelector("[data-scroll]");
const lightboxContainer = document.querySelector("[data-lightbox-container]");

if (scrollContainer && lightboxContainer) {
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

	lightbox("[data-media-expand]", "[data-lightbox]", scroll);

	scroll.on("append", () => {
		frames("[data-reload]");
		timeAgo("[data-time]");
		durationFormat("[data-duration]");
		mediaTriggers("[data-media-container]");
		targetBlankLinks();
	});
} else if (lightboxContainer) {
	lightbox("[data-media-expand]", "[data-lightbox]");
}

// Relayout on image load
new imagesLoaded(document.body, () => {
	if (container && iso) {
		iso.layout();
	}
	document.documentElement.classList.add("loaded");
});

// Media page tags list
(() => {
	const filters = document.querySelector("[data-filter-container]");
	if (!filters || typeof iso === "undefined") return;

	const filterLinks = filters.querySelectorAll("[data-filter]");
	const resetButton = filters.querySelector("[data-reset]");

	filterLinks.forEach((link) => {
		const value = link.getAttribute("data-filter");

		link.addEventListener("click", (e) => {
			e.preventDefault();
			const target = e.target.closest("a");
			if (!target) return;

			iso.arrange({ filter: value });

			const currentActive = filters.querySelector(".active");
			if (!resetButton.classList.contains("visible")) {
				resetButton.classList.add("visible");
			}

			if (currentActive) {
				currentActive.classList.remove("active");
				currentActive.tabIndex = 0;
			}

			if (value !== "*") {
				target.classList.add("active");
				target.tabIndex = -1;
			}

			iso.layout();
		});
	});
})();

// onLoad animation
const loading = document.querySelector(".loading");
const refresh = document.querySelector(".go-home");
const animateQueries = (timeline, key) => {
	new imagesLoaded(document.body, () => {
		if (window.scrollY > 0) timeline.progress(1);
	});

	let storageItem = `${key}PageAnimation`;
	window.onload = () => {
		gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
			if (sessionStorage.getItem(storageItem) === null) {
				gsap.to(loading, {
					duration: .2,
					opacity: 1,
					y: 0,
					ease: "power1.out"
				});

				ScrollTrigger.create({
					trigger: document.body,
					start: "-10",
					end: "50",
					once: true,
					onEnter: () => timeline.resume(),
					onLeave: () => timeline.progress(1)
				});

				document.documentElement.addEventListener("click", e => {
					timeline.progress(1);
				}, {once: true});

				document.documentElement.addEventListener("keydown", e => {
					timeline.progress(1);
				}, {once: true});

				sessionStorage.setItem(storageItem, true);
			} else {
				document.documentElement.classList.add("loaded");
				timeline.progress(1);
			}
		});
	}

	gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
		timeline.progress(1);
	});
}

const animateItems = (items, key) => {
	let enter = gsap.timeline({ paused: true });

	if(loading) {
		let loaded = loading.nextElementSibling;

		enter.to(loading, {
			duration: .2,
			opacity: 0,
			y: "-100%",
			ease: "power1.out",
			onComplete() {
				loading.classList.add("hidden");
			}
		});
		enter.to(loaded, {
			duration: .2,
			opacity: 1,
			y: 0,
			ease: "power1.out"
		});
	}

	items.forEach(item => {
		enter.fromTo(item, {
			opacity: 0,
			y: 20
		}, {
			duration: .5,
			opacity: 1,
			y: 0,
			onComplete() {
				if (item.hasAttribute("data-anim")) item.removeAttribute("data-anim");
				if (refresh) refresh.classList.remove("hidden");
			}
		}, "<.1");
	});

	animateQueries(enter, key);
}