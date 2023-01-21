const Image = require("@11ty/eleventy-img");
const sharp = require("sharp");

module.exports = eleventyConfig => {
	eleventyConfig.addNunjucksAsyncShortcode("stats", async (src, type) => {
		let category = src.split('/')[3];
		let stats = await Image(src, {
			widths: [null],
			statsOnly: true
		});
		let width = stats["webp"][0].width;
		let height = stats["webp"][0].height;
		let result;
		let orientation;

		if(type === "width") {
			result = width;
		} else if(type === "height") {
			result = height
		} else if(type === "orientation") {
			width > height ? orientation = "landscape" : orientation = "portrait"
			result = orientation
		} else if(type === "ratio") {
			result = `${width} / ${height}`
		}

		return result;
    });

	eleventyConfig.addNunjucksAsyncShortcode("image", async (src, alt, type, extra, figp) => {
		let category = src.split('/')[3];
		let name = src.split('/')[4].slice(0, -4);
		let file = src.split(".")[2];
		if(file === "jpg") file = "jpeg";

		let newWidths;
		if(type === "default" && extra === "no-lightbox") {
			newWidths = [100, "auto"]
		} else if(type === "default" && extra != "no-lightbox") {
			newWidths = [100, 900, 1728, 2268, "auto"]
		} else if(type === "thumbnail") {
			newWidths = [50, 300, 600];
		} else if(type === "screen") {
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
		let datasrc;
		if(type === "default" && extra != "no-lightbox") {
			if(stats["webp"][4]) {
				webpset = `${stats["webp"][4].srcset}, ${stats["webp"][3].srcset}, ${stats["webp"][2].srcset}, ${stats["webp"][1].srcset}`;
				regset = `${stats[file][4].srcset}, ${stats[file][3].srcset}, ${stats[file][2].srcset}, ${stats[file][1].srcset}`;
				datasrc = `https://gabriellew.ee${src.substring(1)}`;
			} else {
				webpset = `${stats["webp"][3].srcset}, ${stats["webp"][2].srcset}, ${stats["webp"][1].srcset}`;
				regset = `${stats[file][3].srcset}, ${stats[file][2].srcset}, ${stats[file][1].srcset}`;
				datasrc = `https://gabriellew.ee${src.substring(1)}`;
			}
		} else if(type === "thumbnail" || type === "screen") {
			webpset = `${stats["webp"][1].url}, ${stats["webp"][2].url} 2x`;
			regset = `${stats[file][1].url}, ${stats[file][2].url} 2x`;
		} else if(type === "default" && extra === "no-lightbox") {
			webpset = `${stats["webp"][1].url}`;
			regset = `${stats[file][1].url}`;
		}
		
		let source;
		let img;
		let loading;
		if(Number.isInteger(extra) && extra < 7) {
			loading = "eager";
		} else {
			loading = "lazy";
		}
		if(type === "default" && extra != "no-lightbox") {
			source = `<source type="image/webp" srcset="${webpset}" sizes="(min-width: 2560px) 75vw, (min-width: 768px) 50vw, 100vw">`;
			img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${base64Placeholder}" srcset="${regset}" sizes="(min-width: 2560px) 25vw, (min-width: 768px) 50vw, 100vw" data-src="${datasrc}" width="${basic.width}" height="${basic.height}">`;
		} else if(type === "thumbnail" || type === "screen" || (type === "default" && extra === "no-lightbox")) {
			source = `<source type="image/webp" srcset="${webpset}">`;
			img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${base64Placeholder}" srcset="${regset}" width="${basic.width}" height="${basic.height}">`;
		}

		let picture = `<picture>${source}${img}</picture>`;
		let nbsp = eleventyConfig.getFilter("nbsp");
		let figcaption;
		
		if(extra === "lightbox") {
			figp == null ? figcaption = nbsp(alt) : figcaption = figp;
			let caption = `<figcaption id="${name}-caption" aria-hidden="true">${figcaption}</figcaption>`;
			let link = `<a class="expand" href="#${name}-lightbox" aria-label="Expand image">${picture}</a>`;
			return `<figure id="${name}" aria-labelledby="${name}-caption">${caption}${link}</figure>`;
		} else if(extra === "no-lightbox") {
			figp == null ? figcaption = nbsp(alt) : figcaption = figp;
			let caption = `<figcaption id="${name}-caption" aria-hidden="true">${figcaption}</figcaption>`;
			return `<figure id="${name}" aria-labelledby="${name}-caption">${caption}${picture}</figure>`;
		} else {
			return `${picture}`;
		}
	});
};