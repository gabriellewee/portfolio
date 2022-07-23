const { DateTime, Duration } = require("luxon");
const fs = require("fs");
const Image = require("@11ty/eleventy-img");
const sharp = require("sharp");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const string = require("string");
const nbspFilter = require('eleventy-nbsp-filter');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const sass = require("sass");
const path = require("path");
const minify = require("terser").minify;
const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {
	eleventyConfig.setDataDeepMerge(true);

	eleventyConfig.addPassthroughCopy("robots.txt");
	eleventyConfig.addPassthroughCopy("contact.vcf");
	eleventyConfig.addPassthroughCopy("static/css/no-js.css");
	eleventyConfig.addPassthroughCopy("static/fonts");
	eleventyConfig.addPassthroughCopy("static/images");
	eleventyConfig.addPassthroughCopy({"_includes/svg":"static/images/svg"});
	
	eleventyConfig.addTransform("minify", async (content, outputPath) => {
		if (outputPath.endsWith(".html")) {
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
			if(parsed.name.startsWith(".")) {
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
		slugify: s => string(s).slugify().toString(),
		permalink: markdownItAnchor.permalink.ariaHidden({
			class: "direct-link",
			symbol: "¶",
			placement: "after"
		})
	});
	eleventyConfig.setLibrary("md", markdownLibrary);

	eleventyConfig.addFilter("capitalize", text => {
		return text.charAt(0).toUpperCase() + text.slice(1);
	});

	eleventyConfig.addFilter("readableDataDate", date => {
		return DateTime.fromISO(date, {zone: 'utc'}).toFormat("dd LLLL yyyy");
	});

	eleventyConfig.addFilter('htmlDateString', date => {
		return DateTime.fromJSDate(date, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});
	
	eleventyConfig.addFilter("timeAgo", date => {
		return DateTime.fromJSDate(date, {zone: 'utc'}).toRelative();
	});

	eleventyConfig.addFilter("readableDate", date => {
		return DateTime.fromJSDate(date, {zone: 'utc'}).toFormat("dd LLLL yyyy");
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

	eleventyConfig.addFilter("limit", (array, limit) => {
		return array.slice(0, limit);
	});

	eleventyConfig.addFilter("index", (array, index) => {
		return array.slice(index - 1, index);
	});

	eleventyConfig.addFilter("nbsp", nbspFilter(2, 40));

	eleventyConfig.addFilter("stripAttr", stripped => {
		let removals = /<div class="lightbox-group">([\s\S]*?)<\/div>|<figure class="animation">([\s\S]*?)<\/figure>|<\/?a class="expand"[^>]*>|<\/?span[^>]*>|<\/?picture[^>]*>|<\/?source[^>]*>|<\/?div[^>]*>|<\/?script[^>]*>|\t|\r|\n/g;
		stripped = stripped.replace(removals, '');
		stripped = stripped
			.replace(/<\s*p .*?data-slug-hash="([^<]*)" data-default.*?>[^<]*<\s*a.*?>[^<]*<\/p>/g, '<iframe src="https://codepen.io/gabriellewee/embed/$1">')
			.replace(/<\s*img loading="lazy" decoding="async"/g, '<img')
			.replace(/src="data:image\/png;base64,[\s\S]*?" srcset="[\s\S]*?" sizes="[\s\S]*?" data-src="([^<]*)"/g, 'src="$1"')
			.replace(/( <a class="direct-link" href="[\s\S]*?">¶<\/a>)/g, '')
			.replace(/<\s*h(\d).*?>/g, '<h$1>')
			.replace(/<\s*figure.*?>/g, '<figure>')
			.replace(/<\s*figcaption.*?>/g, '<figcaption>')
			.replace(/<\s*pre.*?>/g, '<pre>')
			.replace(/<\s*code.*?>/g, '<code>');
		return stripped;
	});

    eleventyConfig.addFilter('splitLines', function(input) {
        const parts = input.split(' ');
        const lines = parts.reduce(function(prev, current) {
	        if (!prev.length) {
	            return [current];
	        }
	        let lastOne = prev[prev.length - 1];
	        if (lastOne.length + current.length > 18) {
	            return [...prev, current];
	        }
	        prev[prev.length - 1] = lastOne + ' ' + current;
	        return prev;
        }, []);

        return lines;
    });

	eleventyConfig.addNunjucksAsyncShortcode("image", async (src, alt, type, extra) => {
		let category = src.split('/')[3];
		let name = src.split('/')[4].slice(0, -4);
		let file = src.split(".")[2];
		if(file === "jpg") file = "jpeg";
		
		let newWidths;
		if(type === "default") {
			newWidths = [100, 900, 1728, 2268, null]
		} else if(type === "thumbnail") {
			newWidths = [50, 400, 800];
		} else if(type === "screen") {
			newWidths = [100, 1728, null];
		}

		let stats = await Image(src, {
			widths: newWidths,
			formats: ["webp", file],
			urlPath: `/static/images/${category}/built`,
			outputDir: `./_site/static/images/${category}/built`,
		});

		let lowest = stats[file][0];
		let basic;
		if(type === "default" || type === "screen") {
			basic = stats[file][2];
		} else if(type === "thumbnail") {
			basic = stats[file][1];
		}

		const placeholder = await sharp(lowest.outputPath)
			.resize({ fit: sharp.fit.inside })
			.blur()
			.toBuffer();

		const base64Placeholder = `data:image/png;base64,${placeholder.toString("base64")}`;
		
		let webpset;
		let regset;
		let datasrc;
		if(type === "default") {
			webpset = `${stats["webp"][3].srcset}, ${stats["webp"][2].srcset}, ${stats["webp"][1].srcset}`;
			regset = `${stats[file][3].srcset}, ${stats[file][2].srcset}, ${stats[file][1].srcset}`;
			datasrc = `https://gabriellew.ee${src.substring(1)}`;
		} else if(type === "thumbnail" || type === "screen") {
			webpset = `${stats["webp"][1].url}, ${stats["webp"][2].url} 2x`;
			regset = `${stats[file][1].url}, ${stats[file][2].url} 2x`;
		}
		
		let source;
		let img;
		let loading;
		if(Number.isInteger(extra) && extra < 7) {
			loading = "eager";
		} else {
			loading = "lazy";
		}
		if(type === "default") {
			source = `<source type="image/webp" srcset="${webpset}" sizes="(min-width: 2560px) 25vw, (min-width: 768px) 50vw, 100vw">`;
			img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${base64Placeholder}" srcset="${regset}" sizes="(min-width: 2560px) 25vw, (min-width: 768px) 50vw, 100vw" data-src="${datasrc}" width="${basic.width}" height="${basic.height}">`;
		} else if(type === "thumbnail" || type === "screen") {
			source = `<source type="image/webp" srcset="${webpset}">`;
			img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${base64Placeholder}" srcset="${regset}" width="${basic.width}" height="${basic.height}">`;
		}
		
		let picture = `<picture>${source}${img}</picture>`;
		let caption = `<figcaption id="${name}-caption" aria-hidden="true">${alt}</figcaption>`;
		let link = `<a class="expand" href="#${name}-lightbox" aria-label="Expand image">${picture}</a>`;
		
		if(extra === "lightbox") {
			return `<figure id="${name}" aria-labelledby="${name}-caption">${caption}${link}</figure>`;
		} else {
			return `${picture}`;
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

    eleventyConfig.on('afterBuild', () => {
        const directory = "_site/static/images/og/post/";
        fs.readdir(directory, function (err, files) {
            if (files.length > 0) {
                files.forEach(function (filename) {
                    if (filename.endsWith(".svg")) {
                        let imageUrl = directory + filename;
                        Image(imageUrl, {
                            formats: ["jpeg"],
                            outputDir: "./" + directory,
                            filenameFormat: function (id, src, width, format, options) {
                                let outputFilename = filename.substring(0, (filename.length-4));
                                return `${outputFilename}.${format}`;
                            }
                        });
                    }
                })
            }
        })
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
