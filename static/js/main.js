const lazyLoadInstance = new LazyLoad();

const iso = new Isotope(document.querySelector(".grid-isotope"), {
	percentPosition: true,
	layoutMode: "packery",
	itemSelector: ".grid-item"
});
const isoLayout = new imagesLoaded(window, { background: true }, () => {
	setTimeout(() => {
		iso.layout();
		setTimeout(() => {
			document.querySelector("header").classList.add("active")
		}, 500);
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