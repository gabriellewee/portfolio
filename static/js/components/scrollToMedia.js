// Scroll to media when the tab focus is on its <summary> element
export const scrollToMedia = (summaries = "[data-media-container] summary") => {
	document.querySelectorAll(summaries).forEach((summary) => {
		summary.addEventListener("focus", () => {
			if (!summary.matches(":focus-visible")) return;

			const figure = summary.closest(".media-data");
			if (!figure) return;

			const rect = figure.getBoundingClientRect();
			const fullyVisible =
				rect.top >= 0 &&
				rect.bottom <= window.innerHeight;

			if (!fullyVisible) {
				figure.scrollIntoView({
					behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
					block: "center"
				});
			}
		});
	});
};