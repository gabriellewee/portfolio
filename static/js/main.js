const noJS = (() => {
	document.documentElement.classList.remove("no-js")
	document.documentElement.classList.add("js")
})();

const lazyLoadInstance = new LazyLoad();

let iso;
let container = document.querySelector(".grid-isotope");
const isoTrigger = ((el) => {
	iso = new Isotope(el, {
		percentPosition: true,
		layoutMode: "packery",
		itemSelector: ".grid-item"
	});
});
const isoContainer = (() => {
	if(document.body.clientWidth >= 834) {
		container ? isoTrigger(container) : null
	}
	window.addEventListener("resize", function() {
		setTimeout(() => {
			if(document.body.clientWidth >= 834) {
				if(container && iso === undefined) {
					isoTrigger(container);
				}
			}
		}, 500);
	});
})();

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
		tagTrigger.addEventListener("keypress",  e => {
			if (e.keyCode == 13) {
				tagTrigger.checked ? tagTrigger.checked = false : tagTrigger.checked = true;
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

const visualInfoTriggers = ((buttons = Array.from(document.querySelectorAll(".grid-input"))) => {
	if(buttons) {
		buttons.forEach(button=>{
			let info = button.parentNode.querySelector(".grid-info");
			let name = button.getAttribute("id").slice(0, -5);
			let expand = info.querySelector(".grid-expand");
			info.setAttribute("aria-hidden", "true");
			button.addEventListener("focus", e => {
				document.getElementById(name).scrollIntoView({ behavior: "smooth" });
			});
			button.addEventListener("keypress", e => {
				if (e.keyCode == 13) {
					if(button.checked){
						button.checked = false;
						expand.tabIndex = -1;
						info.setAttribute("aria-hidden", "true");
					} else {
						button.checked = true;
						expand.tabIndex = 0;
						info.setAttribute("aria-hidden", "false");
					}
				}
			});
		});
	}
})();