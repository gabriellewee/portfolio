import { DateTime } from 'luxon';

const getUTCDate = (date) =>
	DateTime.isDateTime(date)
		? date.setZone('utc')
		: DateTime.fromJSDate(date, { zone: 'utc' }).isValid
		? DateTime.fromJSDate(date, { zone: 'utc' })
		: DateTime.fromISO(date, { zone: 'utc' });

export const date = (date, option = "") => {
	const dt = getUTCDate(date);

	const formats = {
		archive: 'yyyy/L/d',
		string: 'yyyy-LL-dd',
		readable: 'dd LLLL yyyy',
	};

	return dt.toFormat(formats[option] || 'yyyy/LL/dd');
};

export const year = (date) => getUTCDate(date).toFormat('yyyy');

export const iso = (date) => getUTCDate(date).toISO();