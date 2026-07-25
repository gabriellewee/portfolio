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

// Scroll to post when the tab focus is on focus trigger
export const scrollToFocus = (triggers = "[data-focus]") => {
	document.querySelectorAll(triggers).forEach((trigger) => {
		trigger.addEventListener("focus", () => {
			if (!trigger.matches(":focus-visible")) return;

			const target = trigger.closest("[data-focus-container]");
			if (!target) return;

			scrollToTarget(target);
		});
	});
};