import dotenv from 'dotenv';
dotenv.config();

import filters from './_config/filters.js';
import plugins from './_config/plugins.js';
import shortcodes from './_config/shortcodes.js';

// trqnsform
import * as sass from 'sass'
import path from 'path';
import { minify } from 'terser';
import htmlmin from 'html-minifier-terser';
import voca from 'voca';

export default function (eleventyConfig) {
	eleventyConfig.setQuietMode(true);

	// filters
	eleventyConfig.addFilter('nbsp', filters.nbspFilter(2, 100));
	eleventyConfig.addFilter('date', filters.date);
	eleventyConfig.addFilter('year', filters.year);
	eleventyConfig.addFilter('iso', filters.iso);
	eleventyConfig.addFilter('images', filters.images);
	eleventyConfig.addFilter('limit', filters.limit);
	eleventyConfig.addFilter('index', filters.index);
	eleventyConfig.addFilter('isoFilter', filters.isoFilter);
	eleventyConfig.addFilter('removeEmoji', filters.removeEmoji);
	eleventyConfig.addFilter('platform', filters.platform);
	eleventyConfig.addFilter('stripAttr', filters.stripAttr);

	// plugins
	eleventyConfig.addPlugin(plugins.eleventyNavigationPlugin);
	eleventyConfig.addPlugin(plugins.feedPlugin);
	eleventyConfig.addPlugin(plugins.syntaxHighlight);

	// libraries
	eleventyConfig.setLibrary('md', plugins.markdownLibrary);

	// shortcodes
	eleventyConfig.addShortcode('copyright', shortcodes.copyright);
	eleventyConfig.addShortcode('today', shortcodes.today);
	eleventyConfig.addShortcode('stats', shortcodes.stats);
	eleventyConfig.addShortcode('external', shortcodes.external);
	eleventyConfig.addShortcode('ogPhoto', shortcodes.ogPhoto);
	eleventyConfig.addShortcode('unfurlGame', shortcodes.unfurlGame);
	eleventyConfig.addShortcode('image', shortcodes.image);
	eleventyConfig.addShortcode('excerpt', shortcodes.excerpt);

	// passthrough
	[
		"robots.txt",
		"contact.vcf",
		"static/fonts",
		"static/css/fonts",
		"static/images",
		"static/code/images"
	].forEach(path =>
		eleventyConfig.addPassthroughCopy(path)
	);

	eleventyConfig.addPassthroughCopy({
		"static/images/favicons": "/",
		"_includes/svg": "static/images/svg",
		"node_modules/gsap/dist/gsap.min.js": "static/js/gsap.min.js",
		"node_modules/gsap/dist/ScrollTrigger.min.js": "static/js/scroll-trigger.min.js",
		"node_modules/gsap/dist/TextPlugin.min.js": "static/js/text.min.js",
		"node_modules/imagesloaded/imagesloaded.pkgd.min.js": "static/js/imagesloaded.min.js",
		"node_modules/isotope-layout/dist/isotope.pkgd.min.js": "static/js/isotope.min.js",
		"node_modules/isotope-packery/packery-mode.pkgd.min.js": "static/js/packery.min.js",
		"node_modules/luxon/build/global/luxon.min.js": "static/js/luxon.min.js",
		"node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js": "static/js/smoothscroll.min.js",
		"node_modules/jquery/dist/jquery.min.js": "static/code/js/jquery.min.js",
		"node_modules/clipboard/dist/clipboard.min.js": "static/code/js/clipboard.min.js",
		"node_modules/draggabilly/dist/draggabilly.pkgd.min.js": "static/code/js/draggabilly.min.js",
		"node_modules/zdog/dist/zdog.pkgd.min.js": "static/code/js/zdog.min.js"
	});

	// posts
	eleventyConfig.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: "<!-- more -->"
	});

	const stripTags = (content) => {
		if (content.startsWith("<")) {
			return voca.stripTags(content);
		} else {
			return content;
		}
	};

	const createPlatforms = (entry, mainEntry) => {
		if (!mainEntry.data.external) {
			mainEntry.data.external = [];
		}
		if (!mainEntry.data.external.some(item => item.url === entry.data.url)) {
			mainEntry.data.external.push({
				platform: entry.data.source,
				url: entry.data.url,
				icon: true,
				gradient: true
			});
		}
	};

	const compareTime = (timestamp, date) => {
		return Math.abs(timestamp - new Date(date).getTime());
	};

	eleventyConfig.addCollection("entries", function (collectionApi) {
		const entries = [...collectionApi.getFilteredByTag("entries")];
		const threshold = 21600000;

		return entries.filter(entry => {
			if (entry.data.self == true || entry.data.hide == true || entry.data.in_reply != null || entry.data.visibility === "direct") return false;

			let blueskyPosts = new Map();
			let mastodonPosts = new Map();

			for (let entry of entries) {
				if (entry.data.source === "bluesky") {
					let timestamp = new Date(entry.date).getTime();
					blueskyPosts.set(timestamp, entry);
				} else if (entry.data.source === "mastodon") {
					let timestamp = new Date(entry.date).getTime();
					mastodonPosts.set(timestamp, entry);
				}
			}

			if (entry.data.source === "mastodon" || entry.data.source === "threads") {
				for (let [timestamp, blueskyEntry] of blueskyPosts) {
					let entryContent = stripTags(entry.data.content);
					let blueskyContent = blueskyEntry.data.content;
					if (
						(compareTime(timestamp, entry.date) < threshold) &&
						(entryContent && blueskyContent &&
					entryContent.trim().substring(0, 20) === blueskyContent.trim().substring(0, 20))
					) {
						createPlatforms(entry, blueskyEntry);
						return false;
					}
				}
			}
			if (entry.data.source === "threads") {
				for (let [timestamp, mastodonEntry] of mastodonPosts) {
					let entryContent = entry.data.content;
					let mastodonContent = stripTags(mastodonEntry.data.content);
					if (
						(compareTime(timestamp, entry.date) < threshold) &&
						(entryContent && mastodonContent &&
					entryContent.trim().substring(0, 20) === mastodonContent.trim().substring(0, 20))
					) {
						createPlatforms(entry, mastodonEntry);
						return false;
					}
				}
			}

			return entry.data;
		});
	});

	// transform
	eleventyConfig.addTransform("minify", async (content, outputPath) => {
		if (outputPath && outputPath.endsWith(".html")) {
			return await htmlmin.minify(content, {
				collapseWhitespace: true,
				removeComments: true,  
				useShortDoctype: true,
			});
		}
		return content;
	});

	eleventyConfig.addTemplateFormats("js");
	eleventyConfig.addExtension("js", {
		outputFileExtension: "js",
		compile: (inputContent, inputPath) => {
			let parsed = path.parse(inputPath);
			if (parsed.name.startsWith(".")) {
				return;
			}
			return async (data) => {
				let minified = await minify(inputContent, {});
				return minified.code;
			};
		}
	});

	eleventyConfig.addTemplateFormats("scss");
	eleventyConfig.addExtension("scss", {
		outputFileExtension: "css",
		compile: (inputContent, inputPath) => {
			let parsed = path.parse(inputPath);
			if (parsed.name.startsWith("_")) {
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

	// formats
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

	// watch
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
};
