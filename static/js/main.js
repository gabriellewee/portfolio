const frames = (buttons) => {
	let links = Array.from(document.querySelectorAll(buttons));
	if (!links) return;
	links.forEach(button => {
		let frame = button.parentElement.querySelector("iframe");
		button.addEventListener("click",  e => {
			frame.src = frame.src;
		});
		button.addEventListener("keydown",  e => {
			if (e.key === "Enter") {
				frame.src = frame.src;
			}
		});
	});
}

const mediaTriggers = (media) => {
	let figures = Array.from(document.querySelectorAll(media));
	if (!figures) return;
	figures.forEach(figure=>{
		let trigger = figure.querySelector("[data-media-trigger]");
		let data = figure.querySelector("[data-media-info]");
		let expand = figure.querySelector("[data-media-expand]");
		let external = Array.from(figure.querySelectorAll("[data-media-external]"));
		let name = trigger.getAttribute("id").slice(0, -5);
		let labels = Array.from(figure.querySelectorAll("[data-media-label]"));
		data.setAttribute("aria-hidden", "true");
		trigger.addEventListener("focus", e => {
			document.getElementById(name).scrollIntoView({ behavior: "smooth" });
		});
		let _true = () => {
			trigger.setAttribute("aria-checked", "true");
			data.removeAttribute("aria-hidden");
			expand.tabIndex = 0;
			if (external) {
				external.forEach(link=> {
					link.tabIndex = 0;
				});
			}
		}
		let _false = () => {
			trigger.setAttribute("aria-checked", "false");
			data.setAttribute("aria-hidden", "true");
			expand.tabIndex = -1;
			if (external) {
				external.forEach(link=> {
					link.tabIndex = -1;
				});
			}
		}
		trigger.addEventListener("click", e => {
			if (trigger.checked){
				_true();
			} else {
				_false();
			}
		});
		trigger.addEventListener("keydown", e => {
			if (e.key === "Enter") {
				if (trigger.checked){
					trigger.checked = false;
					_false();
				} else {
					trigger.checked = true;
					_true();
				}
			}
		});
		labels.forEach(label=>{
			label.addEventListener("click", e => {
				if (trigger.checked){
					_true();
				} else {
					_false();
				}
			});
		});
	});
}

frames("[data-reload]");
timeAgo("[data-time]");
durationFormat("[data-duration]");
mediaTriggers("[data-media-container]");

let container = document.querySelector("[data-grid]");
let iso;
let motionClass = document.documentElement.classList.contains("theme-reduce-motion");
let motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
const layout = (items) => {
	items.setAttribute("data-grid", "true");
	if ((motionClass == false && motion.matches == true) || (!motionClass && motion.matches == true)) {
		iso = new Isotope(items, {
			percentPosition: true,
			layoutMode: "packery",
			itemSelector: "[data-grid-item]",
			packery: {
				gutter: 24
			}
		});
	} else {
		iso = new Isotope(items, {
			percentPosition: true,
			layoutMode: "packery",
			itemSelector: "[data-grid-item]",
			packery: {
				gutter: 24
			},
			hiddenStyle: {
				opacity: 0
			},
			visibleStyle: {
				opacity: 1
			}
		});
	}
}

if (container) layout(container);

let scrollContainer = document.querySelector("[data-scroll]");
let lightboxContainer = document.querySelector("[data-lightbox-container]");
if (scrollContainer && lightboxContainer) {
	let scroll = new InfiniteScroll(scrollContainer, {
		button: '[data-load]',
		path: '[data-load-path]',
		append: '[data-post-append]',
		scrollThreshold: false,
		outlayer: iso
	});
	let lightboxScroll = new InfiniteScroll(lightboxContainer, {
		button: '[data-load]',
		path: '[data-load-path]',
		append: '[data-lightbox-append]',
		scrollThreshold: false,
		history: false
	});
	lightbox("[data-media-expand]", "[data-lightbox]", scroll);
	scroll.on('append', (body, path, items, response) => {
		frames("[data-reload]");
		timeAgo("[data-time]");
		durationFormat("[data-duration]");
		mediaTriggers("[data-media-container]");
	});
} else {
	lightbox("[data-media-expand]", "[data-lightbox]");
}

new imagesLoaded(document.body, () => {
	if (container && iso != undefined) {
		iso.layout();
	}
	document.documentElement.classList.add("loaded");
});

const mediaFilters = ((filters = document.querySelector("[data-filter-container]")) => {
	if (!filters) return;
	let links = filters.querySelectorAll("[data-filter]");
	links.forEach(link=>{
		let value = link.getAttribute("data-filter");
		let reset = filters.querySelector("[data-reset]");
		link.addEventListener("click", e => {
			e.preventDefault();
			iso.arrange({ filter: value });
			let active = filters.querySelector(".active");
			if (!reset.classList.contains("visible")) {
				reset.classList.add("visible");
			}
			if (active && value == "*") {
				active.classList.remove("active");
				active.tabIndex = 0;
			} else if (active) {
				active.classList.remove("active");
				active.tabIndex = 0;
				e.target.closest("a").classList.add("active");
				e.target.closest("a").tabIndex = -1;
			} else {
				e.target.closest("a").classList.add("active");
				e.target.closest("a").tabIndex = -1;
			};
			iso.layout();
		});
	});
})();

const copyButtons = ((buttons = Array.from(document.querySelectorAll("[data-clip]"))) => {
	if (!buttons) return;
	buttons.forEach(button=>{
		button.addEventListener("click", e => {
			e.preventDefault();
			return false;
		});
		let clipboard = new ClipboardJS(button);
		clipboard.on("success", e => {
			if (button.tagName === "INPUT") {
				e.trigger.parentNode.classList.remove("hidden");
			} else {
				e.trigger.classList.remove("hidden");
			}
			setTimeout(() => {
				if (button.tagName === "INPUT") {
					e.trigger.parentNode.classList.add("hidden");
				} else {
					e.trigger.classList.add("hidden");
				}
			}, 3000);
		});
	});
})();

const animateQueries = (timeline, key) => {
	new imagesLoaded(document.body, () => {
		if (window.scrollY > 0) {
			timeline.progress(1);
		}
	});

	let storageItem = `${key}PageAnimation`;
	window.onload = () => {
		gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
			if (sessionStorage.getItem(storageItem) === null) {
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
	items.forEach(item => {
		enter.fromTo(item, {
			opacity: 0,
			y: 20
		}, {
			duration: .5,
			opacity: 1,
			y: 0,
			onComplete() {
				if (item.classList.contains("post-animate")) item.classList.remove("post-animate");
		    }
		}, "<.1");
	});

	animateQueries(enter, key);
}

const targetBlankLinks = ((links = document.getElementsByTagName("a")) => {
	for (var i = 0; i < links.length; i++) {
		if (/^(https?:)?\/\//.test(links[i].getAttribute("href"))) {
			links[i].target = "_blank";
		}
	}
})();