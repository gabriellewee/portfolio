// Media page filters list
export const mediaFilters = () => {
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
};
