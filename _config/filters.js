const { DateTime, Duration } = require("luxon");
const nbspFilter = require('eleventy-nbsp-filter');
const util = require("util");

module.exports = eleventyConfig => {
	eleventyConfig.addFilter("nbsp", nbspFilter(2, 100));

	eleventyConfig.addFilter("limit", (array, limit) => {
		return array.slice(0, limit);
	});

	eleventyConfig.addFilter("index", (array, index) => {
		return array.slice(index - 1, index);
	});

	eleventyConfig.addFilter('dump', obj => {
		return util.inspect(obj)
	});

	eleventyConfig.addFilter("capitalize", text => {
		return text.charAt(0).toUpperCase() + text.slice(1);
	});

	eleventyConfig.addFilter("readableDate", date => {
		date = DateTime.fromJSDate(date, {zone: 'utc'}).toFormat("dd LLLL yyyy") || DateTime.fromISO(date, {zone: 'utc'}).toFormat("dd LLLL yyyy")
		return date;
	});

	eleventyConfig.addFilter('htmlDateString', date => {
		date = DateTime.fromJSDate(date, {zone: 'utc'}).toFormat('yyyy-LL-dd') || DateTime.fromISO(date, {zone: 'utc'}).toFormat('yyyy-LL-dd');
		return date;
	});

	eleventyConfig.addFilter('linkDate', date => {
		return DateTime.fromISO(date, {zone: 'utc'}).toFormat('yyyy/LL/dd');
	});
	
	eleventyConfig.addFilter("timeAgo", date => {
		date = DateTime.fromJSDate(date, {zone: 'utc'}).toRelative() || DateTime.fromISO(date, {zone: 'utc'}).toRelative();
		return date;
	});

	eleventyConfig.addNunjucksAsyncShortcode("year", async (year) => {
		if(year === "start") {
			year = "2012";
		} else if(year === "current") {
			year = DateTime.fromJSDate(new Date(), {zone: 'utc'}).toFormat("yyyy");
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
};