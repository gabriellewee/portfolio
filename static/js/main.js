const noJS = (() => {
	document.documentElement.classList.remove("no-js");
	document.documentElement.classList.add("js");
})();

const clipboardCopy = (() => {
	let container = document.querySelector(".discord");
	if(container) {
		let discordWindow = container.querySelector(".discord-window");
		let discordArrow = container.querySelector(".discord-label");

		let copyTrigger = container.querySelector("input");
		let closeTrigger = container.querySelector(".close");
		let triggers = Array.from([copyTrigger, closeTrigger]);
		
		let copyElem = container.querySelector(".username");
		
		triggers.forEach(trigger =>{
			trigger.addEventListener("keydown",  e => {
				if (e.key === "Enter") {
					if(copyTrigger.checked) {
						copyTrigger.checked = false;
						copyElem.classList.remove("copied");
						copyTrigger.focus();
					} else {
						copyTrigger.checked = true;
					}
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
					closeTrigger.focus();
				}, 50);
			}
		})

		container.addEventListener("keydown",  e => {
			if (e.key === "Escape") {
				copyTrigger.checked = false;
				copyElem.classList.remove("copied");
				copyTrigger.focus();
			}
		});
		document.addEventListener("scroll", e => {
			if(copyTrigger.checked) {
				setTimeout(() => {
					copyTrigger.checked = false;
					discordWindow.classList.remove("active");
					discordArrow.classList.remove("active");
					copyElem.classList.remove("copied");
				}, 300);
			}
		});
	}
})();

let container = document.querySelector(".grid-isotope");
let iso = new Isotope(container, {
	percentPosition: true,
	layoutMode: "packery",
	itemSelector: ".grid-item"
});

const loading = new imagesLoaded(document.body, { background: true }, () => {
	setTimeout(() => {
		if(container && iso != undefined) {
			iso.layout();
		}
		setTimeout(() => {
			document.documentElement.classList.add("loaded")
		}, 250);
	}, 100);
});

const visualFilters = ((filters = document.querySelector(".grid-filters")) => {
	if (filters) {
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
			link.addEventListener("click", function(e) {
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
	}
})();

const visualInfoTriggers = ((figures = Array.from(document.querySelectorAll(".grid-figure"))) => {
	if(figures) {
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
	}
})();