const { DateTime } = require("luxon");
const fs = require("fs");
const Image = require("@11ty/eleventy-img");
const sharp = require("sharp");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
	eleventyConfig.setDataDeepMerge(true);

	eleventyConfig.addPlugin(pluginRss);

	eleventyConfig.addPlugin(syntaxHighlight, {
		preAttributes: {
			tabindex: 0
		},
 	});

	let markdownLibrary = markdownIt({
		html: true,
		breaks: true,
		linkify: true,
		typographer: true
	}).use(markdownItAnchor, {
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

	eleventyConfig.addFilter("isoFilter", filterObj => {
		let array = filterObj.split(' ');
		let result = array.map(el => 'filter-' + el);
		return result.join(' ');
	});

	eleventyConfig.addFilter("limit", (array, limit) => {
		return array.slice(0, limit);
	});

	eleventyConfig.addFilter("head", (array, n) => {
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	eleventyConfig.addFilter("stripAttr", stripObj => {
		stripObj = stripObj
			.replace(/<\/?span[^>]*>/g, '')
			.replace(/<\/?div[^>]*>/g, '')
			.replace(/<\/?script[^>]*>/g, '')
			.replace(/<\/?a class="expand"[^>]*>/g, '')
			.replace(/<\s*p .*?data-slug-hash="([^<]*)" data-default.*?>([^<]*)<\s*a.*?>([^<]*)<\/p>/g, '<iframe src="https://codepen.io/gabriellewee/embed/$1">')
			.replace(/(<a(?: \w+="[^"]+")* class="lightbox"(?: \w+="[^"]+")*>([^<]*)<\/a>)/g, '')
			.replace(/(<a(?: \w+="[^"]+")* class="direct-link"(?: \w+="[^"]+")*>([^<]*)<\/a>)/g, '')
			.replace(/<\s*h1.*?>/g, '<h1>')
			.replace(/<\s*h2.*?>/g, '<h2>')
			.replace(/<\s*h3.*?>/g, '<h3>')
			.replace(/<\s*h4.*?>/g, '<h4>')
			.replace(/<\s*h5.*?>/g, '<h5>')
			.replace(/<\s*h6.*?>/g, '<h6>')
			.replace(/<\s*figure.*?>/g, '<figure>')
			.replace(/<\s*pre.*?>/g, '<pre>')
			.replace(/<\s*code.*?>/g, '<code>')
			.replace(/<\s*p data-height.*?>/g, '<p>');
		return stripObj;
	});

	eleventyConfig.addPassthroughCopy("static");
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
			decoding="async"
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
			decoding="async"
			alt="${alt}"
			src="${base64Placeholder}"
			srcset="${pngset}"
			width="${basic.width}"
			height="${basic.height}">`;

		return `<picture>${source}${img}</picture>`;
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
