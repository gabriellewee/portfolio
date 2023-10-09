const Image = require("@11ty/eleventy-img");
const sharp = require("sharp");

module.exports = eleventyConfig => {
	eleventyConfig.addNunjucksAsyncShortcode("stats", async (src, type) => {
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
    });

    eleventyConfig.addNunjucksAsyncShortcode("external", async (src, alt, width, loading) => {
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
			outputDir: `./_site/static/images/external`,
		});

		const placeholder = await sharp(stats[file][0].outputPath)
			.resize({ fit: sharp.fit.inside })
			.blur()
			.toBuffer();
		const base64Placeholder = `data:image/png;base64,${placeholder.toString("base64")}`;
		
		let result = `
			<picture>
				<source type="image/webp" srcset="${stats["webp"][0].url}, ${stats["webp"][1].url} 2x">
				<img loading=${loading} decoding="async" alt="${alt}" src="${base64Placeholder}" srcset="${stats[file][0].url}, ${stats[file][1].url} 2x" width="${stats["webp"][0].width}" height="${stats["webp"][0].height}">
			</picture>
		`;

		return result;
    });

	eleventyConfig.addNunjucksAsyncShortcode("image", async (src, alt, type, option, figp) => {
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
			outputDir: `./_site/static/images/${category}/built`,
		});

		let lowest = stats[file][0];
		let basic = stats[file][1];

		const placeholder = await sharp(lowest.outputPath)
			.resize({ fit: sharp.fit.inside })
			.blur()
			.toBuffer();

		const base64Placeholder = `data:image/png;base64,${placeholder.toString("base64")}`;
		
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
				img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${base64Placeholder}" srcset="${regset}" sizes="${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px, (min-width: 1549px) ${stats["webp"][4].width}px" width="${basic.width}" height="${basic.height}">`;
			} else {
				source = `<source type="image/webp" srcset="${webpset}" sizes="${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px">`;
				img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${base64Placeholder}" srcset="${regset}" sizes="${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px" width="${basic.width}" height="${basic.height}">`;
			}
		} else if (type === "thumbnail" || type === "screen") {
			source = `<source type="image/webp" srcset="${webpset}">`;
			img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${base64Placeholder}" srcset="${regset}" width="${basic.width}" height="${basic.height}">`;
		}

		let picture = `<picture>${source}${img}</picture>`;
		let nbsp = eleventyConfig.getFilter("nbsp");
		let figcaption;
		
		if (option === "lightbox") {
			figp == null ? figcaption = nbsp(alt) : figcaption = figp;
			let caption = `<figcaption id="${name}-caption" aria-hidden="true">${figcaption}</figcaption>`;
			let link = `<a class="expand" href="#${name}-lightbox" aria-label="${alt} Expand image">${picture}</a>`;
			return `<figure id="${name}" aria-labelledby="${name}-caption">${caption}${link}</figure>`;
		} else {
			return `${picture}`;
		}
	});
};