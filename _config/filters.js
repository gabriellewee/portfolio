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
		date = DateTime.fromISO(date, {zone: 'utc'}).toFormat("dd LLLL yyyy");
		return date;
	});

	eleventyConfig.addFilter('htmlDateString', date => {
		date = DateTime.fromISO(date, {zone: 'utc'}).toFormat('yyyy-LL-dd');
		return date;
	});

	eleventyConfig.addFilter('linkDate', date => {
		return DateTime.fromISO(date, {zone: 'utc'}).toFormat('yyyy/LL/dd');
	});
	
	eleventyConfig.addFilter("ISO", date => {
		date = DateTime.fromJSDate(date, {zone: 'utc'}).toISO() || DateTime.fromISO(date, {zone: 'utc'}).toISO();
		return date;
	});

	eleventyConfig.addNunjucksAsyncShortcode("year", async (year) => {
		if (year === "start") {
			year = "2012";
		} else if (year === "current") {
			year = DateTime.fromJSDate(new Date(), {zone: 'utc'}).toFormat("yyyy");
		} else {
			year = "";
		}
		return year;
	});

	eleventyConfig.addNunjucksAsyncShortcode("icondate", async (icondate) => {
		icondate = DateTime.fromJSDate(new Date(), {zone: 'utc'}).toFormat("yyyyLLdd");
		return icondate;
	});

	eleventyConfig.addFilter("isoFilter", filters => {
		let array = filters.split(' ');
		let result = array.map(el => 'filter-' + el);
		return result.join(' ');
	});
};