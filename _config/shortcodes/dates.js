import { DateTime, Duration } from 'luxon';

export const copyright = (year) => {
	if (year === "start") {
		return "2012";
	} else if (year === "current") {
		return DateTime.fromJSDate(new Date(), {zone: 'utc'}).toFormat("yyyy");
	} else {
		return "";
	}
};

export const today = (date) => DateTime.fromJSDate(new Date(), {zone: 'utc'}).toFormat("yyyyLLdd");