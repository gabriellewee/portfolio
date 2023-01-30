const { DateTime, Duration } = require("luxon");
const nbspFilter = require('eleventy-nbsp-filter');

module.exports = eleventyConfig => {
	eleventyConfig.addFilter("nbsp", nbspFilter(2, 100));

	eleventyConfig.addFilter("limit", (array, limit) => {
		return array.slice(0, limit);
	});

	eleventyConfig.addFilter("index", (array, index) => {
		return array.slice(index - 1, index);
	});

	eleventyConfig.addFilter("readableDate", date => {
		date = DateTime.fromISO(date, {zone: 'utc-8'}).toFormat("dd LLLL yyyy");
		return date;
	});

	eleventyConfig.addFilter('htmlDateString', date => {
		date = DateTime.fromISO(date, {zone: 'utc-8'}).toFormat('yyyy-LL-dd');
		return date;
	});

	eleventyConfig.addFilter('ogDateString', date => {
		date = DateTime.fromISO(date, {zone: 'utc'}).toFormat('yyyy-LL-dd');
		return date;
	});

	eleventyConfig.addFilter('linkDate', date => {
		return DateTime.fromISO(date, {zone: 'utc-8'}).toFormat('yyyy/LL/dd');
	});
	
	eleventyConfig.addFilter("ISO", date => {
		date = DateTime.fromJSDate(date, {zone: 'utc-8'}).toISO() || DateTime.fromISO(date, {zone: 'utc-8'}).toISO();
		return date;
	});

	eleventyConfig.addNunjucksAsyncShortcode("year", async (year) => {
		if(year === "start") {
			year = "2012";
		} else if(year === "current") {
			year = DateTime.fromJSDate(new Date(), {zone: 'utc-8'}).toFormat("yyyy");
		} else {
			year = "";
		}
		return year;
	});

	eleventyConfig.addFilter("isoFilter", filters => {
		let array = filters.split(' ');
		let result = array.map(el => 'filter-' + el);
		return result.join(' ');
	});

	eleventyConfig.addFilter("platform", platform => {
		platform = platform.split('/')[4];
		platform = platform.charAt(0).toUpperCase() + platform.slice(1);
		return `<span> on ${platform}</span>`;
	});
};