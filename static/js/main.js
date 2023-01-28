const noJS = ((container = document.documentElement) => {
	container.classList.remove("no-js");
	container.classList.add("js");
	hidden = Array.from(document.querySelectorAll("[hidden]"));
	if(hidden) {
		hidden.forEach(el => {
			el.removeAttribute("hidden");
		});
	}
})();

function frames(buttons) {
	let links = Array.from(document.querySelectorAll(buttons));
	if(!links) return;
	links.forEach(button => {
		let frame = button.nextElementSibling;
		button.addEventListener("click",  e => {
			frame.src = frame.src;
		});
	});
}

function timeAgo(dates) {
	let datesISO = Array.from(document.querySelectorAll(dates));
	if(!datesISO) return;
	datesISO.forEach(date =>{
		let datetime = date.getAttribute("data-time");
		if(!datetime) return;
		let relativeTime = luxon.DateTime.fromISO(datetime, {zone: 'utc'}).toRelative();
		date.innerHTML = relativeTime;
	});
}

frames(".reload");
timeAgo("time");
lightbox(".expand");

let container = document.querySelector(".grid-isotope");
let scrollContainer = document.querySelector(".grid-scroll");
let lightboxContainer = document.querySelector(".posts-lightbox-group");
let motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
let iso;

if(container) {
	if(motion.matches == true) {
		iso = new Isotope(container, {
			percentPosition: true,
			layoutMode: "packery",
			itemSelector: ".grid-item",
			packery: {
				gutter: 24
			}
		});
	} else {
		iso = new Isotope(container, {
			percentPosition: true,
			layoutMode: "packery",
			itemSelector: ".grid-item",
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
	if(scrollContainer && lightboxContainer) {
		let scroll = new InfiniteScroll(scrollContainer, {
			button: '.load',
			path: '.older',
			append: '.post',
			scrollThreshold: false,
			outlayer: iso
		});
		let lightboxScroll = new InfiniteScroll(lightboxContainer, {
			button: '.load',
			path: '.older',
			append: '.post-lightbox',
			scrollThreshold: false,
			history: false
		});
		scroll.on('append', (body, path, items, response) => {
			frames(".reload");
			lightbox(".expand");
			timeAgo("time");
		});
	}
}

const loading = new imagesLoaded(document.body, () => {
	if(container && iso != undefined) {
		iso.layout();
	}
	document.documentElement.classList.add("loaded");
});

const mediaFilters = ((filters = document.querySelector(".filters")) => {
	if (!filters) return;
	let links = filters.querySelectorAll("[data-filter]");
	links.forEach(link=>{
		let value = link.getAttribute("data-filter");
		let reset = filters.querySelector(".reset");
		link.addEventListener("click", e => {
			e.preventDefault();
			iso.arrange({ filter: value });
			let active = filters.querySelector(".active");
			if(!reset.classList.contains("visible")) {
				reset.classList.add("visible");
			}
			if (active && value == "*") {
				active.classList.remove("active");
				active.tabIndex = 0;
			} else if (active) {
				active.classList.remove("active");
				active.tabIndex = 0;
				e.target.parentElement.classList.add("active");
				e.target.parentElement.tabIndex = -1;
			} else {
				e.target.parentElement.classList.add("active");
				e.target.parentElement.tabIndex = -1;
			};
			iso.layout();
		});
	});
})();

const popup = ((containers = Array.from(document.querySelectorAll(".popup"))) => {
	if(!containers) return;
	containers.forEach(container =>{
		let popupWindow = container.querySelector(".popup-window");
		let popupLabel = container.querySelector(".popup-label");
		let popupTrigger = container.querySelector(".popup-button");
		let popupClose = container.querySelector(".close");
		let triggers = Array.from([popupTrigger, popupClose]);

		triggers.forEach(trigger =>{
			trigger.addEventListener("keydown",  e => {
				if (e.key === "Enter") {
					if(popupTrigger.checked) {
						popupTrigger.checked = false;
						popupTrigger.focus();
					} else {
						popupTrigger.checked = true;
					}
				}
			});
		});

		container.addEventListener("keydown",  e => {
			if (e.key === "Escape") {
				popupTrigger.checked = false;
				popupTrigger.focus();
			}
		});

		if(container.hasAttribute("data-copy")) {
			let copyElem = container.querySelector(".username");
			triggers.forEach(trigger =>{
				trigger.addEventListener("keydown",  e => {
					if (e.key === "Enter") {
						if(popupTrigger.checked) {
							copyElem.classList.remove("copied");
						}
					}
				});
				trigger.addEventListener("click",  e => {
					if(popupTrigger.checked) {
						setTimeout(() => {
							copyElem.classList.remove("copied");
						}, 300);
					}
				});
			});

			let copyButton = container.querySelector(".copy-button");
			copyButton.removeAttribute("disabled");
			let clipboard = new ClipboardJS(copyButton);

			clipboard.on("success", e => {
				let copy = container.querySelector(e.trigger.getAttribute("data-clipboard-target"));
				copy.parentNode.classList.add("copied");
				e.clearSelection();
			});
			copyButton.addEventListener("keydown", e => {
				if (e.key === "Enter") {
					setTimeout(() => {
						popupClose.focus();
					}, 50);
				}
			});
			container.addEventListener("keydown",  e => {
				if (e.key === "Escape") {
					copyElem.classList.remove("copied");
				}
			});
		}
	})
})();

const mediaTriggers = ((figures = Array.from(document.querySelectorAll(".post-media"))) => {
	if(!figures) return;
	figures.forEach(figure=>{
		let trigger = figure.querySelector(".media-trigger");
		let data = figure.querySelector(".media-data");
		let expand = figure.querySelector(".media-expand");
		let external = Array.from(figure.querySelectorAll(".external"));
		let name = trigger.getAttribute("id").slice(0, -5);
		let labels = Array.from(figure.querySelectorAll("label"));
		data.setAttribute("aria-hidden", "true");
		trigger.addEventListener("focus", e => {
			document.getElementById(name).scrollIntoView({ behavior: "smooth" });
		});
		let _true = (() => {
			trigger.setAttribute("aria-checked", "true");
			data.removeAttribute("aria-hidden");
			expand.tabIndex = 0;
			if(external) {
				external.forEach(link=> {
					link.tabIndex = 0;
				});
			}
		});
		let _false = (() => {
			trigger.setAttribute("aria-checked", "false");
			data.setAttribute("aria-hidden", "true");
			expand.tabIndex = -1;
			if(external) {
				external.forEach(link=> {
					link.tabIndex = -1;
				});
			}
		});
		trigger.addEventListener("click", e => {
			if(trigger.checked){
				_true();
			} else {
				_false();
			}
		});
		trigger.addEventListener("keydown", e => {
			if (e.key === "Enter") {
				if(trigger.checked){
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
				if(trigger.checked){
					_true();
				} else {
					_false();
				}
			});
		});
	});
})();