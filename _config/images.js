const Image = require("@11ty/eleventy-img");
const Sharp = require('sharp');
const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = eleventyConfig => {
	eleventyConfig.addNunjucksAsyncShortcode("stats", async (src, type) => {
		try {
			let stats = await Image(src, {
				widths: [null],
				statsOnly: true
			});
			let width = stats["webp"][0].width;
			let height = stats["webp"][0].height;
			let result;
			let orientation;

			let reduce = (numerator, denominator) => {
				let gcd = (a, b) => {
					return b ? gcd(b, a%b) : a;
				};
				gcd = gcd(numerator, denominator);
				return [numerator/gcd, denominator/gcd];
			}

			if (type === "width") {
				result = width;
			} else if (type === "height") {
				result = height;
			} else if (type === "orientation") {
				width > height ? orientation = "landscape" : orientation = "portrait"
				result = orientation
			} else if (type === "ratio") {
				result = `${reduce(width, height)[0]} / ${reduce(width, height)[1]}`
			}

			return result;
		} catch (error) {
			console.error(src, '\n', error);
		}
	});

	eleventyConfig.addNunjucksAsyncShortcode("external", async (src, alt, width, loading) => {
		try {
			let file = src.split(".");
			file = file[file.length - 1];
			if (file === "jpg") file = "jpeg";
			if (!loading) loading = "lazy";
			alt = alt.replace(/ :(.*?):$/g, '');

			let newWidths;
			if (width > 1000) {
				newWidths = [width/2, width]
			} else {
				newWidths = [width, width*2]
			}

			let stats = await Image(src, {
				widths: newWidths,
				formats: ["webp", file],
				urlPath: `/static/images/external`,
				outputDir: `./_site/static/images/external`
			});
			
			let result = `
				<picture>
					<source type="image/webp" srcset="${stats["webp"][0].url}, ${stats["webp"][1].url} 2x">
					<img loading=${loading} decoding="async" alt="${alt}" src="${stats["webp"][0].url}" srcset="${stats[file][0].url}, ${stats[file][1].url} 2x" width="${stats["webp"][0].width}" height="${stats["webp"][0].height}">
				</picture>
			`;

			return result;
		} catch (error) {
			console.error(src, '\n', error);
		}
	});

	eleventyConfig.addNunjucksAsyncShortcode("ogPhoto", async (src) => {
		try {
			let file = src.split(".");
			file = file[file.length - 1];
			if (file === "jpg") file = "jpeg";

			let image = await Sharp(src).resize({
				width: 1200,
				height: 630
			}).toFormat(file).toBuffer();

			let stats = await Image( image, {
				widths: [null],
				formats: [file],
				urlPath: `/static/images/og`,
				outputDir: `./_site/static/images/og`
			});
			
			let result = stats[file][0].url;

			return result;
		} catch (error) {
			console.error(src, '\n', error);
		}
	});


	eleventyConfig.addNunjucksAsyncShortcode("unfurlGame", async (link, title, className, width, loading) => {
		try {
			const metadata = await EleventyFetch(
				`https://api.microlink.io/?url=${link}`,
				{
					duration: "1d",
					type: "json",
				}
			);

			let type;
			if(metadata.data.image.type === "j2k") {
				type = "jpeg"
			} else {
				type = metadata.data.image.type;
			}
			let image = `${metadata.data.image.url}.${type}`;
			let picture = await eleventyConfig.nunjucksAsyncShortcodes.external(image, title, width, loading);
			let result = `<a class="${className}" href="${link}" target="_blank">${picture}</a>`;

			return result;
		} catch (error) {
			console.error(error);
			return `<a class="${className}" href="${link}"><span>${title}</span></a>`;
		}
	});

	eleventyConfig.addNunjucksAsyncShortcode("image", async (src, alt, type, option, figp) => {
		try {
			let category = src.split('/')[3];
			let name = src.split('/')[4].slice(0, -4);
			let file = src.split(".")[2];
			if (file === "jpg") file = "jpeg";

			let newWidths;
			if (type === "default") {
				newWidths = [100, 900, 1728, 2268, "auto"]
			} else if (type === "thumbnail") {
				newWidths = [50, 300, 600];
			} else if (type === "screen") {
				newWidths = [100, 1728, "auto"];
			}

			let stats = await Image(src, {
				widths: newWidths,
				formats: ["webp", file],
				urlPath: `/static/images/${category}/built`,
				outputDir: `./_site/static/images/${category}/built`
			});

			let lowest = stats[file][0];
			let basic = stats[file][1];
			
			let webpset;
			let regset;
			if (type === "default") {
				if (stats["webp"][4]) {
					webpset = `${stats["webp"][4].srcset}, ${stats["webp"][3].srcset}, ${stats["webp"][2].srcset}, ${stats["webp"][1].srcset}`;
					regset = `${stats[file][4].srcset}, ${stats[file][3].srcset}, ${stats[file][2].srcset}, ${stats[file][1].srcset}`;
				} else {
					webpset = `${stats["webp"][3].srcset}, ${stats["webp"][2].srcset}, ${stats["webp"][1].srcset}`;
					regset = `${stats[file][3].srcset}, ${stats[file][2].srcset}, ${stats[file][1].srcset}`;
				}
			} else if (type === "thumbnail" || type === "screen") {
				webpset = `${stats["webp"][1].url}, ${stats["webp"][2].url} 2x`;
				regset = `${stats[file][1].url}, ${stats[file][2].url} 2x`;
			}
			
			let source;
			let img;
			let loading;
			if (Number.isInteger(option) && option < 7) {
				loading = "eager";
			} else {
				loading = "lazy";
			}
			if (type === "default") {
				if (stats["webp"][4]) {
					source = `<source type="image/webp" srcset="${webpset}" sizes="${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px, (min-width: 1549px) ${stats["webp"][4].width}px">`;
					img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${stats["webp"][0].url}" srcset="${regset}" sizes="${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px, (min-width: 1549px) ${stats["webp"][4].width}px" width="${basic.width}" height="${basic.height}">`;
				} else {
					source = `<source type="image/webp" srcset="${webpset}" sizes="${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px">`;
					img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${stats["webp"][0].url}" srcset="${regset}" sizes="${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px" width="${basic.width}" height="${basic.height}">`;
				}
			} else if (type === "thumbnail" || type === "screen") {
				source = `<source type="image/webp" srcset="${webpset}">`;
				img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${stats["webp"][0].url}" srcset="${regset}" width="${basic.width}" height="${basic.height}">`;
			}

			let picture = `<picture>${source}${img}</picture>`;
			let nbsp = eleventyConfig.getFilter("nbsp");
			let figcaption;
			
			if (option === "lightbox") {
				figp == null ? figcaption = nbsp(alt) : figcaption = figp;
				let caption = `<figcaption id="${name}-caption" aria-hidden="true">${figcaption}</figcaption>`;
				let link = `<a class="expand" href="#${name}-lightbox" aria-label="${alt} Expand image">${picture}</a>`;
				return await `<figure id="${name}" aria-labelledby="${name}-caption">${caption}${link}</figure>`;
			} else {
				return await `${picture}`;
			}
		} catch (error) {
			console.error(src, '\n', error);
		}
	});
};