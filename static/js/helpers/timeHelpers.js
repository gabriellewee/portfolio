import { waitForGlobals } from './domHelpers.js';

// Time ago dates for posts,i.e. "7 months ago"
export const timeAgo = (dates = "[data-time]") => {
	waitForGlobals(["luxon"], (luxon) => {
		const { DateTime } = luxon;
		document.querySelectorAll(dates).forEach((date) => {
			const iso = date.getAttribute("data-time");
			if (!iso) return;

			const platform = date.querySelector("span");
			const offset = date.classList.contains("time-external") ? 0 : 8;

			const relative = DateTime.fromISO(iso).plus({ hours: offset }).toRelative();

			date.textContent = relative;
			if (platform) date.append(platform);
		});
	});
};

// Set hours and minutes for recipe times
export const durationFormat = (times = "[data-duration]") => {
	waitForGlobals(["luxon"], (luxon) => {
		const { Duration } = luxon;
		document.querySelectorAll(times).forEach((time) => {
			const minutes = parseInt(time.getAttribute("data-duration"), 10);
			if (!minutes || minutes <= 60) return;

			const duration = Duration
				.fromObject({ minutes })
				.shiftTo("hours", "minutes")
				.toHuman({ listStyle: "narrow", type: "unit" });

			time.textContent = duration;
		});
	});
};