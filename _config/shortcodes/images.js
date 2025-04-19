import { promises as fs } from "fs"
import Image from '@11ty/eleventy-img';
import Sharp from 'sharp';
import EleventyFetch from '@11ty/eleventy-fetch';
import nbspFilter from 'eleventy-nbsp-filter';

const fetchImageBuffer = async (url) => {
	try {
		return await EleventyFetch(url, {
			duration: "1d",
			type: "buffer",
		});
	} catch (error) {
		console.error("Error fetching image:", error);
		return null;
	}
};

const findExtension = (src) => {
	let file;
	if (src.includes("@")) {
		file = src.split("@");
		file = file[file.length - 1];
	} else if (src.includes("?")) {
		const urlObj = new URL(src);
		urlObj.search = '';
		urlObj.hash = '';
		file = urlObj.toString().split(".");
		file = file[file.length - 1];
	} else {
		file = src.split(".");
		file = file[file.length - 1];
	}
	if (file.toLowerCase() === "jpg") file = "jpeg";

	return file;
};

const reduce = (numerator, denominator) => {
	let gcd = (a, b) => {
		return b ? gcd(b, a%b) : a;
	};
	gcd = gcd(numerator, denominator);
	return [numerator/gcd, denominator/gcd];
};

export const stats = async (src, type, value) => {
	try {
		let image = src.startsWith("https://") ? await fetchImageBuffer(src) : src;
		let result;

		if (type != "color") {
			let stats = await Sharp(image);
			let metadata = await stats.metadata();
			let width = metadata.width;
			let height = metadata.height;
			let percent;
			if(value) percent = value / metadata.width;

			if (type === "width") {
				result = value ? width * percent : width;
			} else if (type === "height") {
				result = value ? height * percent : height;
			} else if (type === "orientation") {
				result = width > height ? "landscape" : "portrait";
			} else if (type === "ratio") {
				result = `${reduce(width, height)[0]} / ${reduce(width, height)[1]}`
			}
		} else {
			const sharpImage = Sharp(image);
			let positionTop = 0;
			let positionLeft = 0;
			const squareWidth = 50;

			const metadata = await sharpImage.metadata();
			if (value.includes("bottom")) {
				positionTop = metadata.height - squareWidth;
			}
			if (value.includes("right")) {
				positionLeft = metadata.width - squareWidth;
			}

			const extracted = sharpImage
				.clone()
				.extract({
					top: positionTop,
					left: positionLeft,
					width: squareWidth,
					height: squareWidth
				});

			const stats = await extracted.stats();

			const avgR = stats.channels[0].mean;
			const avgG = stats.channels[1].mean;
			const avgB = stats.channels[2].mean;

			const brightness = avgR * 0.2126 + avgG * 0.7152 + avgB * 0.0722;
			const result = brightness > 150 ? "light" : "dark";

			return result;
		}

		return result;
	} catch (error) {
		console.error('IMAGE: ' + src, '\n', error, '\n');
	}
};

export const external = async (src, alt, width, loading) => {
	try {
		let file = findExtension(src);
		let image = src.startsWith("https://") ? await fetchImageBuffer(src) : src;
		if (!loading) loading = "lazy";
		alt = alt.replace(/ :(.*?):$/g, '');

		let newWidths;
		if (width > 1000) {
			newWidths = [width/2, width]
		} else if (width <= 1000) {
			newWidths = [width, width*2]
		} else if (width === undefined) {
			let metadata = await Sharp(image).metadata();
			let newWidth = metadata.width;
			newWidths = [newWidth/2, newWidth];
		}

		let stats = await Image(image, {
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
		console.error('Image: ' + src, '\n', error, '\n');
	}
};

export const ogPhoto = async (src) => {
	try {
		let file = findExtension(src);
		let name = src.split(".");
		name = name[1].split("/");
		name = name[name.length-1];

		let result = await Sharp(src).resize({
			width: 1200,
			height: 630
		}).toFormat(file).clone().toFile(`./_site/static/images/og/${name}.${file}`);

		return `/static/images/og/${name}.${file}`;
	} catch (error) {
		console.error('Image: ' + src, '\n', error, '\n');
	}
};

export const unfurlGame = async (link, title, className, width, loading) => {
	try {
		const metadata = await EleventyFetch(
			`https://api.microlink.io/?url=${link}`,
			{
				duration: "1d",
				type: "json",
			}
		);

		let type;
		if (metadata.data.image.type === "j2k" || metadata.data.image.type === "jpg") {
			type = "jpeg"
		} else {
			type = metadata.data.image.type;
		}
		let image = `${metadata.data.image.url}.${type}`;

		let stats = await Image(image, {
			widths: [width, width*2],
			formats: ["webp", type],
			urlPath: `/static/images/external`,
			outputDir: `./_site/static/images/external`
		});
		
		let picture = `
			<picture>
				<source type="image/webp" srcset="${stats["webp"][0].url}, ${stats["webp"][1].url} 2x">
				<img loading=${loading} decoding="async" alt="${title}" src="${stats["webp"][0].url}" srcset="${stats[type][0].url}, ${stats[type][1].url} 2x" width="${stats["webp"][0].width}" height="${stats["webp"][0].height}">
			</picture>
		`;

		let result = `<a class="${className}" href="${link}" target="_blank">${picture}</a>`;

		return result;
	} catch (error) {
		console.error('Title: ' + title, '\n', error, '\n');
		return `<a class="${className} button" href="${link}"><span>${title}</span></a>`;
	}
};

export const image = async (src, alt, type, option, figp) => {
	try {
		let category = src.split('/')[3];
		let name = src.split('/')[4].slice(0, -4);
		let file = src.split(".")[2];
		if (file.toLowerCase() === "jpg") file = "jpeg";

		let newWidths;
		if (type === "default") {
			newWidths = [100, 900, 1728, 2268, "auto"]
		} else if (type === "screen") {
			newWidths = [100, 1728, "auto"];
		} else if (Number.isInteger(type)) {
			newWidths = [50, type, type*2];
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
		} else if (type === "screen" || Number.isInteger(type)) {
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
				source = `<source type="image/webp" srcset="${webpset}" sizes="(max-width: 912px) ${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px, (min-width: 1549px) ${stats["webp"][4].width}px">`;
				img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${stats["webp"][0].url}" srcset="${regset}" sizes="(max-width: 912px) ${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px, (min-width: 1549px) ${stats["webp"][4].width}px" width="${basic.width}" height="${basic.height}">`;
			} else {
				source = `<source type="image/webp" srcset="${webpset}" sizes="(max-width: 912px) ${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px">`;
				img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${stats["webp"][0].url}" srcset="${regset}" sizes="(max-width: 912px) ${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px" width="${basic.width}" height="${basic.height}">`;
			}
		} else if (type === "screen" | Number.isInteger(type)) {
			source = `<source type="image/webp" srcset="${webpset}">`;
			img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${stats["webp"][0].url}" srcset="${regset}" width="${basic.width}" height="${basic.height}">`;
		}

		let picture = `<picture>${source}${img}</picture>`;
		let nbsp = nbspFilter(2, 100);
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
		console.error('Image: ' + src, '\n', error, '\n');
	}
};