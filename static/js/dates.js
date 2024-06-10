const timeAgo = (dates) => {
	let datesISO = Array.from(document.querySelectorAll(dates));
	if (!datesISO) return;
	datesISO.forEach(date =>{
		let datetime = date.getAttribute("data-time");
		if (!datetime) return;
		let platform = date.querySelector("span");
		let relativeTime;
		if (date.classList.contains("time-external")) {
			relativeTime = luxon.DateTime.fromISO(datetime).toRelative();
		} else {
			relativeTime = luxon.DateTime.fromISO(datetime).plus({'hours': +8}).toRelative();
		}
		date.innerHTML = relativeTime;
		if (platform) date.append(platform);
	});
}

const durationFormat = (times) => {
	let timesISO = Array.from(document.querySelectorAll(times));
	if (!timesISO) return;
	timesISO.forEach(time =>{
		let duration = time.getAttribute("data-duration");
		if(duration > 60) {
			let conversion = luxon.Duration.fromObject({minutes: duration}).shiftTo('hours', 'minutes').toHuman({listStyle: "narrow", type: "unit"});
			time.innerHTML = conversion;
		}
	});
}