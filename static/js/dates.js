const timeAgo = (dates) => {
	document.querySelectorAll(dates).forEach((date) => {
		const iso = date.getAttribute("data-time");
		if (!iso) return;

		const platform = date.querySelector("span");
		const offset = date.classList.contains("time-external") ? 0 : 8;

		const relative = luxon.DateTime
			.fromISO(iso)
			.plus({ hours: offset })
			.toRelative();

		date.textContent = relative;
		if (platform) date.append(platform);
	});
};

const durationFormat = (times) => {
	document.querySelectorAll(times).forEach((time) => {
		const minutes = parseInt(time.getAttribute("data-duration"), 10);
		if (!minutes || minutes <= 60) return;

		const duration = luxon.Duration
			.fromObject({ minutes })
			.shiftTo("hours", "minutes")
			.toHuman({ listStyle: "narrow", type: "unit" });

		time.textContent = duration;
	});
};