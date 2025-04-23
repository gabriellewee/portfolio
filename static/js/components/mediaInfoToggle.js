// "View more" info popups for media
export const mediaInfoToggle = (figures = "[data-media-container]") => {
	document.querySelectorAll(figures).forEach((figure) => {
		const trigger = figure.querySelector("[data-media-trigger]");
		const data = figure.querySelector("[data-media-info]");
		const expand = figure.querySelector("[data-media-expand]");
		const external = figure.querySelectorAll("[data-media-external]");
		const labels = figure.querySelectorAll("[data-media-label]");

		if (!trigger || !data || !expand) return;

		const name = trigger.id.replace(/-info$/, "");

		data.setAttribute("aria-hidden", "true");

		const setState = (on) => {
			trigger.setAttribute("aria-checked", on ? "true" : "false");
			data.setAttribute("aria-hidden", on ? "false" : "true");
			expand.tabIndex = on ? 0 : -1;
			external.forEach((el) => (el.tabIndex = on ? 0 : -1));
		};

		trigger.addEventListener("focus", () => {
			document.getElementById(name)?.scrollIntoView({ behavior: "smooth" });
		});

		trigger.addEventListener("click", () => {
			setState(trigger.checked);
		});

		trigger.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				trigger.checked = !trigger.checked;
				setState(trigger.checked);
			}
		});

		labels.forEach((label) => {
			label.addEventListener("click", () => {
				setState(trigger.checked);
			});
		});
	});
};