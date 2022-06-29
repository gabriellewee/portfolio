/*! Various site scripts */
const noJS = ((container = document.documentElement) => {
	container.classList.remove("no-js");
	container.classList.add("js");
})();

let container = document.querySelector(".grid-isotope");
let iso = new Isotope(container, {
	percentPosition: true,
	layoutMode: "packery",
	itemSelector: ".grid-item"
});

const loading = new imagesLoaded(document.body, () => {
	setTimeout(() => {
		if(container && iso != undefined) {
			iso.layout();
		}
		setTimeout(() => {
			document.documentElement.classList.add("loaded")
		}, 250);
	}, 100);
});

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

const visualFilters = ((filters = document.querySelector(".grid-filters")) => {
	if (!filters) return;
	let tagTrigger = filters.querySelector("#grid-filters");
	tagTrigger.addEventListener("keydown",  e => {
		if (e.key === "Enter") {
			if (tagTrigger.checked) {
				tagTrigger.checked = false;
				tagTrigger.setAttribute("aria-checked", "false");
			} else {
				tagTrigger.checked = true;
				tagTrigger.setAttribute("aria-checked", "true");
			}
		}
	});
	tagTrigger.addEventListener("click", e => {
		if(tagTrigger.checked){
			tagTrigger.setAttribute("aria-checked", "true");
		} else {
			tagTrigger.setAttribute("aria-checked", "false");
		}
	});
	let links = filters.querySelectorAll("[data-filter]");
	links.forEach(link=>{
		let value = link.getAttribute("data-filter");
		link.addEventListener("click", e => {
			e.preventDefault();
			iso.arrange({ filter: value });
			let active = filters.querySelector(".active");
			if (active && value == "*") {
				active.classList.remove("active");
			} else if (active) {
				active.classList.remove("active");
				e.target.classList.add("active");
			} else {
				e.target.classList.add("active");
			};
			iso.layout();
		});
	});
})();

const visualInfoTriggers = ((figures = Array.from(document.querySelectorAll(".grid-figure"))) => {
	if(!figures) return;
	figures.forEach(figure=>{
		let button = figure.querySelector(".grid-input")
		let info = figure.querySelector(".grid-info");
		let expand = figure.querySelector(".grid-expand");
		let external = figure.querySelector(".external");
		let name = button.getAttribute("id").slice(0, -5);
		let labels = Array.from(figure.querySelectorAll("label"));
		info.setAttribute("aria-hidden", "true");
		button.addEventListener("focus", e => {
			document.getElementById(name).scrollIntoView({ behavior: "smooth" });
		});
		let _true = (() => {
			button.setAttribute("aria-checked", "true");
			info.removeAttribute("aria-hidden");
			expand.tabIndex = 0;
			if(external) external.tabIndex = 0;
		});
		let _false = (() => {
			button.setAttribute("aria-checked", "false");
			info.setAttribute("aria-hidden", "true");
			expand.tabIndex = -1;
			if(external) external.tabIndex = -1;
		});
		button.addEventListener("click", e => {
			if(button.checked){
				_true();
			} else {
				_false();
			}
		});
		button.addEventListener("keydown", e => {
			if (e.key === "Enter") {
				if(button.checked){
					button.checked = false;
					_false();
				} else {
					button.checked = true;
					_true();
				}
			}
		});
		labels.forEach(label=>{
			label.addEventListener("click", e => {
				if(button.checked){
					_true();
				} else {
					_false();
				}
			});
		});
	});
})();