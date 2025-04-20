// Popups
(() => {
	const containers = document.querySelectorAll("[data-popup]");
	if (!containers.length) return;

	containers.forEach((container) => {
		const popupWindow = container.querySelector("[data-popup-window]");
		const popupTrigger = container.querySelector("[data-popup-trigger]");
		const popupClose = container.querySelector("[data-popup-close]");
		if (!popupTrigger || !popupWindow) return;

		const triggers = [popupTrigger, popupClose].filter(Boolean);

		const setState = (on, focus = false) => {
			popupTrigger.checked = on;
			popupTrigger.toggleAttribute("checked", on);
			popupTrigger.setAttribute("aria-pressed", on.toString());
			popupTrigger.setAttribute("aria-expanded", on.toString());
			if (!on && focus) popupTrigger.focus();
		};

		triggers.forEach((trigger) => {
			trigger.addEventListener("click", () => {
				setState(popupTrigger.checked);
			});
			trigger.addEventListener("keydown", (e) => {
				if (e.key === "Enter") {
					setState(!popupTrigger.checked, !popupTrigger.checked);
				}
			});
		});

		container.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				setState(false, true);
			}
		});

		ScrollTrigger.create({
			trigger: popupWindow,
			start: "top top",
			end: "bottom top",
			onLeave: () => {
				if (popupTrigger.checked) setState(false);
			},
		});
	});
})();