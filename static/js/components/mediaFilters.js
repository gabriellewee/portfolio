// Media page filters list
// Media page filters list
export const mediaFilters = (filters = document.querySelector("[data-filter-container]")) => {
	if (typeof iso === "undefined") return;

	const filterLinks = filters.querySelectorAll("[data-filter]");
	const resetButton = filters.querySelector("[data-reset]");

	const toSelector = (tag) => (tag === "*" ? "*" : `.filter-${tag}`);

	const applyFilter = (link) => {
		const tag = link.dataset.filter;
		window.iso.arrange({ filter: toSelector(tag) });

		const currentActive = filters.querySelector(".active");
		if (currentActive && currentActive !== link) {
			currentActive.classList.remove("active");
			currentActive.removeAttribute("aria-current");
			currentActive.removeAttribute("aria-disabled");
		}

		if (tag !== "*") {
			link.classList.add("active");
			link.setAttribute("aria-current", "true");
			link.setAttribute("aria-disabled", "true");
			resetButton.classList.add("visible");
		} else {
			resetButton.classList.remove("visible");
		}

		window.iso.layout();
	};

	const setTagParam = (tag) => {
		const url = new URL(location);
		if (tag && tag !== "*") {
			url.searchParams.set("tag", tag);
		} else {
			url.searchParams.delete("tag");
		}
		history.pushState(null, "", url);
	};

	const applyFromParams = () => {
		const tag = new URLSearchParams(location.search).get("tag") || "*";
		const match = [...filterLinks].find((l) => l.dataset.filter === tag);
		if (match) applyFilter(match);
	};

	filterLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			setTagParam(link.dataset.filter);
			applyFilter(link);
		});
	});

	window.addEventListener("popstate", applyFromParams);
	window.addEventListener("load", applyFromParams);
};