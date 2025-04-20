import { DateTime } from "luxon";

const utcNow = () => DateTime.utc();

export const copyright = (year) => {
	const map = {
		start: "2012",
		current: utcNow().toFormat("yyyy"),
	};

	return map[year] ?? "";
};

export const today = () => utcNow().toFormat("yyyyLLdd");