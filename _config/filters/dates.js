import { DateTime, Duration } from 'luxon';

export const date = (date, option) => {
	if (option === "archive") {
		return DateTime.fromISO(date, {zone: 'utc'}).toFormat('yyyy/L/d');
	} else if (option === "string") {
		return DateTime.fromISO(date, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	} else if (option === "readable") {
		return DateTime.fromISO(date, {zone: 'utc'}).toFormat("dd LLLL yyyy");
	} else {
		return DateTime.fromISO(date, {zone: 'utc'}).toFormat('yyyy/LL/dd');
	}
};

export const year = (date) => DateTime.fromJSDate(date, {zone: 'utc'}).toFormat('yyyy') || DateTime.fromISO(date, {zone: 'utc'}).toFormat('yyyy');

export const iso = (date) => DateTime.fromJSDate(date, {zone: 'utc'}).toISO() || DateTime.fromISO(date, {zone: 'utc'}).toISO();