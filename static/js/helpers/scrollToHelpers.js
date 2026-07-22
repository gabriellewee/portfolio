// Scroll to target if target is less than halfway in the viewport
export const scrollToTarget = (target) => {
	const rect = target.getBoundingClientRect();
	const viewportHeight = window.innerHeight;

	const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
	const visibleRatio = visibleHeight / Math.min(rect.height, viewportHeight);
	if (visibleRatio >= 0.5) return;

	target.scrollIntoView({
		behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
		block: "center"
	});
};

// Scroll to media when the tab focus is on its <summary> element
export const scrollToMedia = (summaries = "[data-media-container] summary") => {
	document.querySelectorAll(summaries).forEach((summary) => {
		summary.addEventListener("focus", () => {
			if (!summary.matches(":focus-visible")) return;

			const target = summary.closest(".media-data");
			if (!target) return;

			scrollToTarget(target);
		});
	});
};