let container = document.querySelector(".grid ul");
let iso = new Isotope(container, {
	percentPosition: true,
	layoutMode: "packery",
	itemSelector: "li"
});

let filters = document.querySelector(".filter ul");
let pkf = new Isotope(filters, {
	percentPosition: true,
	layoutMode: "packery",
	itemSelector: "li"
});

let main = document.querySelector(".main");
let loading = new imagesLoaded(document.body, () => {
	setTimeout(() => {
		if(container && iso != undefined) {
			iso.layout();
		}
		if(container && pkf != undefined) {
			pkf.layout();
		}
		setTimeout(() => {
			main.classList.add("animated");
		}, 250);
	}, 100);
});

let visualFilters = ((filters = document.querySelector(".filter")) => {
	if (!filters) return;
	let tagTrigger = filters.querySelector("#grid-filters");
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
// });