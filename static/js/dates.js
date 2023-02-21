const timeAgo = (dates) => {
	let datesISO = Array.from(document.querySelectorAll(dates));
	if(!datesISO) return;
	datesISO.forEach(date =>{
		let datetime = date.getAttribute("data-time");
		if(!datetime) return;
		let platform = date.querySelector("span");
		let relativeTime;
		if(date.classList.contains("time-external")) {
			relativeTime = luxon.DateTime.fromISO(datetime).toRelative();
		} else {
			relativeTime = luxon.DateTime.fromISO(datetime).plus({'hours': +8}).toRelative();
		}
		date.innerHTML = relativeTime;
		if(platform) date.append(platform);
	});
}