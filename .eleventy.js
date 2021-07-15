const { DateTime } = require("luxon");
const fs = require("fs");
const Image = require("@11ty/eleventy-img");
const sharp = require("sharp");

module.exports = function(eleventyConfig) {
	eleventyConfig.setDataDeepMerge(true);

	eleventyConfig.addFilter("readableDataDate", dateObj => {
		return DateTime.fromISO(dateObj, {zone: 'utc'}).toFormat("dd LLLL yyyy");
	});

	eleventyConfig.addFilter("readableDate", dateObj => {
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLLL yyyy");
	});

	eleventyConfig.addFilter("isoFilter", function(filterObj) {
		let array = filterObj.split(' ');
		let result = array.map(el => 'filter-' + el);
		return result.join(' ');
	});

	eleventyConfig.addFilter("limit", function(array, limit) {
		return array.slice(0, limit);
	});

	eleventyConfig.addFilter("head", (array, n) => {
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	eleventyConfig.addPassthroughCopy("static");
	eleventyConfig.addPassthroughCopy("v1");
	eleventyConfig.addPassthroughCopy("v2");
	eleventyConfig.addPassthroughCopy("v3");
	eleventyConfig.addPassthroughCopy("v4");
	eleventyConfig.addPassthroughCopy("nameplate/v1/static");
	eleventyConfig.addPassthroughCopy("nameplate/v1/about");
	eleventyConfig.addPassthroughCopy("nameplate/v1/disclaimer");
	eleventyConfig.addPassthroughCopy("nameplate/v1/email");
	eleventyConfig.addPassthroughCopy("nameplate/v1/lists");
	eleventyConfig.addPassthroughCopy("nameplate/v1/other");
	eleventyConfig.addPassthroughCopy("nameplate/v2/static");
	eleventyConfig.addPassthroughCopy("robots.txt");
	eleventyConfig.addPassthroughCopy("sitemap.xml");

	eleventyConfig.addNunjucksAsyncShortcode("image", async (src, alt, aspect, type, category) => {
		let newWidths;

		if(category === "photography") {
			if(type === "full") {
				if(aspect === 'horizontal') {
					newWidths = [100, 1512, 3024, null];
				} else if(aspect === 'vertical') {
					newWidths = [100, 1134, 2268, null];
				}
			} else if(type === "thumbnail") {
				newWidths = [50, 400, null];
			}
		} else if(category === "art") {
			if(type === "full") {
				newWidths = [100, 1500, null]
			} else if(type === "thumbnail") {
				newWidths = [50, 400, 800];
			}
		}

		let stats = await Image(src, {
			widths: newWidths,
			formats: ["webp", "jpeg"],
			urlPath: `/static/images/${category}/built`,
			outputDir: `./_site/static/images/${category}/built`,
		});

		let lowest = stats["jpeg"][0];
		let basic = stats["jpeg"][1];

		const placeholder = await sharp(lowest.outputPath)
			.resize({ fit: sharp.fit.inside })
			.blur()
			.toBuffer();

		const base64Placeholder = `data:image/png;base64,${placeholder.toString(
			"base64"
		)}`;

		const webpset = `${stats["webp"][1].url}, ${stats["webp"][2].url} 2x`;
		const jpegset = `${stats["jpeg"][1].url}, ${stats["jpeg"][2].url} 2x`;

		const source = `<source type="image/webp" srcset="${webpset}" >`;

		const img = `<img
			class="lazy"
			loading="lazy"
			alt="${alt}"
			src="${base64Placeholder}"
			srcset="${jpegset}"
			width="${basic.width}"
			height="${basic.height}">`;

		return `<picture>${source}${img}</picture>`;
	});

	eleventyConfig.addNunjucksAsyncShortcode("graphic", async (src, alt, type) => {
		let stats = await Image(src, {
			widths: [100, 400, 800, 1500, null],
			formats: ["webp", "png"],
			urlPath: "/static/images/graphic/built",
			outputDir: "./_site/static/images/graphic/built",
		});

		let lowest = stats["png"][0];
		let basic = stats["png"][3];

		const placeholder = await sharp(lowest.outputPath)
			.resize({ fit: sharp.fit.inside })
			.blur()
			.toBuffer();

		const base64Placeholder = `data:image/png;base64,${placeholder.toString(
			"base64"
		)}`;

		let pngset;
		let webpset;

		if(type === "full") {
			webpset = `${stats["webp"][3].url}, ${src.substring(1).slice(0, -4)}.webp 2x`;
			pngset = `${stats["png"][3].url}, ${src.substring(1)} 2x`;
		} else if(type === "thumbnail") {
			webpset = `${stats["webp"][1].url}, ${stats["webp"][2].url} 2x`;
			pngset = `${stats["png"][1].url}, ${stats["png"][2].url} 2x`;
		}

		const source = `<source type="image/webp" srcset="${webpset}" >`;

		const img = `<img
			class="lazy"
			loading="lazy"
			alt="${alt}"
			src="${base64Placeholder}"
			srcset="${pngset}"
			width="${basic.width}"
			height="${basic.height}">`;

		return `<picture>${source}${img}</picture>`;
	});

	// Browsersync Overrides
	eleventyConfig.setBrowserSyncConfig({
		callbacks: {
			ready: function(err, browserSync) {
				const content_404 = fs.readFileSync('_site/404.html');

				browserSync.addMiddleware("*", (req, res) => {
					// Provides the 404 content without redirect.
					res.write(content_404);
					res.end();
				});
			},
		},
		ui: false,
		ghostMode: false
	});

	return {
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid"
		],

		// If your site lives in a different subdirectory, change this.
		// Leading or trailing slashes are all normalized away, so don’t worry about those.

		// If you don’t have a subdirectory, use "" or "/" (they do the same thing)
		// This is only used for link URLs (it does not affect your file structure)
		// Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

		// You can also pass this in on the command line using `--pathprefix`
		// pathPrefix: "/",

		markdownTemplateEngine: "liquid",
		htmlTemplateEngine: "njk",
		dataTemplateEngine: "njk",

		// These are all optional, defaults are shown:
		dir: {
			input: ".",
			includes: "_includes",
			data: "_data",
			output: "_site"
		}
	};
};
