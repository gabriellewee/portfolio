const { DateTime } = require("luxon");
const fs = require("fs");
const Image = require("@11ty/eleventy-img");
const sharp = require("sharp");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const sass = require("sass");
const path = require("path");

module.exports = function(eleventyConfig) {
	eleventyConfig.setDataDeepMerge(true);

	eleventyConfig.addPassthroughCopy("admin");
	eleventyConfig.addPassthroughCopy("robots.txt");
	eleventyConfig.addPassthroughCopy("contact.vcf");
	eleventyConfig.addPassthroughCopy("static/css/no-js.css");
	eleventyConfig.addPassthroughCopy("static/fonts");
	eleventyConfig.addPassthroughCopy("static/images");
	eleventyConfig.addPassthroughCopy("static/js");

	eleventyConfig.addTemplateFormats("scss");

	eleventyConfig.addExtension("scss", {
		outputFileExtension: "css",
		compile: function(inputContent, inputPath) {
			let parsed = path.parse(inputPath);
			if(parsed.name.startsWith("_")) {
				return;
			}
			return async (data) => {
				let result = sass.compileString(inputContent, {
					style: "compressed",
					loadPaths: [
						parsed.dir || "."
					]
				});
				return result.css.toString("utf8");
			};
		}
	});

	eleventyConfig.addPlugin(pluginRss);

	eleventyConfig.addPlugin(syntaxHighlight);

	let markdownLibrary = markdownIt({
		html: true,
		breaks: true,
		linkify: true,
		typographer: true
	}).use(markdownItAnchor, {
		slugify: string => string.trim().toLowerCase().replace(/\s+/g, '-').replace(/[!"#$%&'()*+,./:;<=>?@[\]^_`{|}~]/g, ''),
		permalink: true,
		permalinkClass: "direct-link",
		permalinkSymbol: "¶"
	});
	eleventyConfig.setLibrary("md", markdownLibrary);

	eleventyConfig.addFilter("readableDataDate", dateObj => {
		return DateTime.fromISO(dateObj, {zone: 'utc'}).toFormat("dd LLLL yyyy");
	});

	eleventyConfig.addFilter('htmlDateString', dateObj => {
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});

	eleventyConfig.addFilter("readableDate", dateObj => {
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLLL yyyy");
	});

	eleventyConfig.addNunjucksAsyncShortcode("year", async (yearObj) => {
		let year;
		if(yearObj === "start") {
			year = "2012";
		} else if(yearObj === "current") {
			year = DateTime.fromJSDate(new Date(), {zone: 'utc'}).toFormat("yyyy");
		} else {
			year = "";
		}
		return year;
	});

	eleventyConfig.addFilter("isoFilter", filterObj => {
		let array = filterObj.split(' ');
		let result = array.map(el => 'filter-' + el);
		return result.join(' ');
	});

	eleventyConfig.addFilter("limit", (array, limit) => {
		return array.slice(0, limit);
	});

	eleventyConfig.addFilter("stripAttr", stripObj => {
		stripObj = stripObj
			.replace(/(<div class="lightbox-group">([\s\S]*?)<\/div>)/g, '')
			.replace(/(<figure class="animation">([\s\S]*?)<\/figure>)/g, '')
			.replace(/<\/?a class="expand"[^>]*>/g, '')
			.replace(/<\/?a class="expand "[^>]*>/g, '')
			.replace(/<\/?div class="highlight "[^>]*>/g, '')
			.replace(/<\s*p .*?data-slug-hash="([^<]*)" data-default.*?>([^<]*)<\s*a.*?>([^<]*)<\/p>/g, '<iframe src="https://codepen.io/gabriellewee/embed/$1">')
			.replace(/<\s*img loading="lazy" decoding="async" alt="([^<]*)" src="data:image\/png;base64,([\s\S]*?)" srcset="([^<]*), ([^<]*) 2x" width="([^<]*)" height="([^<]*)">/g, '<img alt="$1" src="$4" width="$5" height="$6">')
			.replace(/(<a(?: \w+="[^"]+")* class="direct-link"(?: \w+="[^"]+")*>([^<]*)<\/a>)/g, '')
			.replace(/<\/?span[^>]*>/g, '')
			.replace(/<\/?picture[^>]*>/g, '')
			.replace(/<\/?source[^>]*>/g, '')
			.replace(/<\/?div[^>]*>/g, '')
			.replace(/<\/?script[^>]*>/g, '')
			.replace(/<\s*h1.*?>/g, '<h1>')
			.replace(/<\s*h2.*?>/g, '<h2>')
			.replace(/<\s*h3.*?>/g, '<h3>')
			.replace(/<\s*h4.*?>/g, '<h4>')
			.replace(/<\s*h5.*?>/g, '<h5>')
			.replace(/<\s*h6.*?>/g, '<h6>')
			.replace(/<\s*figure.*?>/g, '<figure>')
			.replace(/<\s*pre.*?>/g, '<pre>')
			.replace(/<\s*code.*?>/g, '<code>');
		return stripObj;
	});

	eleventyConfig.addNunjucksAsyncShortcode("image", async (src, alt, aspect, type, category, lightbox, caption) => {
		let newWidths;
		let newFormats;

		if(category === "photography" || category === "posts") {
			if(type === "full") {
				if(aspect === 'horizontal') {
					newWidths = [100, 1512, 3024, null];
				} else if(aspect === 'vertical') {
					newWidths = [100, 1134, 2268, null];
				}
			} else if(type === "thumbnail") {
				newWidths = [50, 400, 800];
			}
		} else if(category === "art") {
			if(type === "full") {
				newWidths = [100, 1500, null]
			} else if(type === "thumbnail") {
				newWidths = [50, 400, 800];
			}
		} else if(category === "archive") {
			newWidths = [100, null, null]
		} else if(category === "graphic") {
			newWidths = [100, 400, 800, 1500, null]
		}

		(category === "graphic") ? newFormats = ["webp", "png"]: newFormats = ["webp", "jpeg"];

		let stats = await Image(src, {
			widths: newWidths,
			formats: newFormats,
			urlPath: `/static/images/${category}/built`,
			outputDir: `./_site/static/images/${category}/built`,
		});

		let lowest;
		let basic;

		if(category === "graphic") {
			if(type === "full") {
				lowest = stats["png"][0];
				basic = stats["png"][3];
			} else if(type === "thumbnail") {
				lowest = stats["png"][0];
				basic = stats["png"][1];
			}
		} else {
			lowest = stats["jpeg"][0];
			basic = stats["jpeg"][1];
		}

		const placeholder = await sharp(lowest.outputPath)
			.resize({ fit: sharp.fit.inside })
			.blur()
			.toBuffer();

		const base64Placeholder = `data:image/png;base64,${placeholder.toString(
			"base64"
		)}`;

		let webpset;
		let regset;
		
		let large = stats["webp"][2].url || src.substring(1).slice(0, -4);

		if(category === "graphic") {
			if(type === "full") {
				webpset = `${stats["webp"][3].url}, ${src.substring(1).slice(0, -4)}.webp 2x`;
				regset = `${stats["png"][3].url}, ${src.substring(1)} 2x`;
			} else if(type === "thumbnail") {
				webpset = `${stats["webp"][1].url}, ${stats["webp"][2].url} 2x`;
				regset = `${stats["png"][1].url}, ${stats["png"][2].url} 2x`;
			}
		} else {
			webpset = `${stats["webp"][1].url}, ${large} 2x`;
			regset = `${stats["jpeg"][1].url}, ${large} 2x`;
		}

		const source = `<source type="image/webp" srcset="${webpset}">`;

		const img = `<img loading="lazy" decoding="async" alt="${alt}" src="${base64Placeholder}" srcset="${regset}" width="${basic.width}" height="${basic.height}">`;

		const url = src.substring(1);

		let figcaption;
		caption ? figcaption = `<figcaption>${alt}</figcaption>` : figcaption = ``;

		if(lightbox) {
			return `<figure id="${lightbox}">${figcaption}
				<a class="expand" href="#${lightbox}-lightbox" aria-label="Expand image">
					<picture>${source}${img}</picture>
				</a>
			</figure>`;
		} else {
			return `<picture>${source}${img}</picture>`;
		}
	});

	eleventyConfig.addShortcode('excerpt', post => {
		if (!post.hasOwnProperty('templateContent')) {
			console.warn('❌ Failed to extract excerpt: Document has no property `templateContent`.');
			return;
		}

		const excerptSeparator = '<!--more-->';
		const content = post.templateContent;

		if (content.includes(excerptSeparator)) {
			return content.substring(0, content.indexOf(excerptSeparator)).trim();
		}

		const pCloseTag = '</p>';
			if (content.includes(pCloseTag)) {
			return content.substring(0, content.indexOf(pCloseTag) + pCloseTag.length);
		}

		return content;
	});

	eleventyConfig.setBrowserSyncConfig({
		callbacks: {
			ready: function(err, browserSync) {
				const content_404 = fs.readFileSync('_site/404.html');

				browserSync.addMiddleware("*", (req, res) => {
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
		markdownTemplateEngine: "liquid",
		htmlTemplateEngine: "njk",
		dataTemplateEngine: "njk",
	};
};
