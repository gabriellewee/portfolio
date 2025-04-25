import { promises as fs } from "fs"
import path from "path";
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

export const findExtension = (src) => {
	try {
		let cleanSrc = src.includes("@") ? src.split("@").pop() : src;

		let ext;
		if (cleanSrc.includes(".")) {
			const url = new URL(src, "http://dummy");
			ext = url.pathname.split(".").pop().toLowerCase();
		} else {
			ext = cleanSrc.toLowerCase();
		}

		switch (ext) {
			case "jpg":
			case "jpe":
			case "jfif":
				return "jpeg";
			case "tif":
				return "tiff";
			default:
				return ext || "jpeg";
		}
	} catch {
		return "jpeg";
	}
};

export const stats = async (src, type, value) => {
	try {
		const isProd = process.env.ELEVENTY_ENV === "production";
		if (!isProd && type === "average") {
			return "hsl(0 0% 0% / 0)";
		} else if (!isProd && type === "both") {
			return { theme: "dark", average: "hsl(0 0% 0% / 0)" };
		} else if (!isProd && type === "theme") {
			return "dark";
		}

		const image = src.startsWith("https://") ? await fetchImageBuffer(src) : src;
		const sharpImage = Sharp(image);
		const metadata = await sharpImage.metadata();

		const normalize = (val) => (val > 255 ? val / 257 : val);

		const getTheme = async () => {
			const squareWidth = 50;
			let positionTop = 0;
			let positionLeft = 0;

			if (value?.includes("bottom")) positionTop = metadata.height - squareWidth;
			if (value?.includes("right")) positionLeft = metadata.width - squareWidth;

			const extracted = sharpImage
				.clone()
				.extract({ top: positionTop, left: positionLeft, width: squareWidth, height: squareWidth });

			const stats = await extracted.stats();
			const avgR = normalize(stats.channels[0].mean);
			const avgG = normalize(stats.channels[1].mean);
			const avgB = normalize(stats.channels[2].mean);

			const brightness = avgR * 0.2126 + avgG * 0.7152 + avgB * 0.0722;
			return brightness > 180 ? "light" : "dark";
		};

		const getAverage = async () => {
			const stats = await sharpImage.toColourspace("rgb").stats();
			if (!stats.channels || stats.channels.length < 1) return "hsl(0 0% 0% / 0)";

			if (stats.channels.length === 1) {
				const gray = Math.round(normalize(stats.channels[0].mean));
				return `#${gray.toString(16).padStart(2, "0").repeat(3)}`;
			} else {
				const r = Math.round(normalize(stats.channels[0].mean));
				const g = Math.round(normalize(stats.channels[1].mean));
				const b = Math.round(normalize(stats.channels[2].mean));
				return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;
			}
		};

		if (type === "theme") {
			return await getTheme();
		} else if (type === "average") {
			return await getAverage();
		} else if (type === "color") {
			const [theme, average] = await Promise.all([getTheme(), getAverage()]);
			return { theme, average };
		} else {
			const width = metadata.width;
			const height = metadata.height;
			let percent;

			if (value) percent = value / width;

			if (type === "width") return value ? width * percent : width;
			if (type === "height") return value ? height * percent : height;
			if (type === "orientation") return width > height ? "landscape" : "portrait";
			if (type === "ratio") {
				const reduce = (num, den) => {
					const gcd = (a, b) => (b ? gcd(b, a % b) : a);
					const factor = gcd(num, den);
					return [num / factor, den / factor];
				};
				const [w, h] = reduce(width, height);
				return `${w} / ${h}`;
			}
		}
	} catch (error) {
		console.error("IMAGE:", src, "\n", error, "\n");
		return type === "average" ? "hsl(0 0% 0% / 0)" : type === "theme" ? "dark" : undefined;
	}
};

export const external = async (src, alt = "", width, loading = "lazy") => {
	try {
		const file = findExtension(src);
		const image = src.startsWith("https://") ? await fetchImageBuffer(src) : src;
		alt = alt.replace(/ :(.*?):$/g, "");

		let newWidths;
		if (!width) {
			const metadata = await Sharp(image).metadata();
			width = metadata.width;
		}
		newWidths = width > 1000 ? [width / 2, width] : [width, width * 2];

		const stat = await Image(image, {
			widths: newWidths,
			formats: ["webp", file],
			urlPath: "/static/images/external",
			outputDir: "./_site/static/images/external"
		});

		const average = await stats(src, "average");

		const main = stat["webp"];
		const fallback = stat[file];

		return `
			<picture style="--background: ${average}">
				<source type="image/webp" srcset="${main[0].url}, ${main[1].url} 2x">
				<img  
					loading="${loading}" 
					decoding="async" 
					alt="${alt}"
					src="${main[0].url}" 
					srcset="${fallback[0].url}, ${fallback[1].url} 2x" 
					width="${main[0].width}" 
					height="${main[0].height}">
			</picture>
		`.trim();
	} catch (error) {
		console.error("Image:", src, "\n", error, "\n");
	}
};

export const ogPhoto = async (src) => {
	try {
		const file = findExtension(src).toLowerCase();
		const basename = path.basename(src, path.extname(src));
		const outputPath = `./_site/static/images/og/${basename}.${file}`;
		const outputUrl = `/static/images/og/${basename}.${file}`;

		await Sharp(src)
			.resize({ width: 1200, height: 630 })
			.toFormat(file)
			.toFile(outputPath);

		return outputUrl;
	} catch (error) {
		console.error("OG Image:", src, "\n", error, "\n");
	}
};

export const unfurlGame = async (link, title, className, width, loading = "lazy") => {
	try {
		const metadata = await EleventyFetch(`https://api.microlink.io/?url=${link}`, {
			duration: "1d",
			type: "json",
		});

		const rawType = metadata.data?.image?.type || "jpeg";
		const type = rawType === "j2k" || rawType === "jpg" ? "jpeg" : rawType;
		const image = `${metadata.data.image.url}.${type}`;

		const stat = await Image(image, {
			widths: [width, width * 2],
			formats: ["webp", type],
			urlPath: "/static/images/external",
			outputDir: "./_site/static/images/external",
		});

		const average = await stats(image, "average");

		const main = stat["webp"];
		const fallback = stat[type];

		const picture = `
			<picture style="--background: ${average}" >
				<source type="image/webp" srcset="${main[0].url}, ${main[1].url} 2x">
				<img 
					loading="${loading}" 
					decoding="async" 
					alt="${title}" 
					src="${main[0].url}" 
					srcset="${fallback[0].url}, ${fallback[1].url} 2x" 
					width="${main[0].width}" 
					height="${main[0].height}">
			</picture>
		`.trim();

		return `<a class="${className}" href="${link}" target="_blank" rel="noopener noreferrer">${picture}</a>`;
	} catch (error) {
		console.error("unfurlGame error:", title, "\n", error, "\n");
		return `<a class="${className} button" href="${link}"><span>${title}</span></a>`;
	}
};

export const image = async (src, alt = "", type = "default", option, figp) => {
	try {
		const category = src.split("/")[3];
		const name = path.basename(src, path.extname(src));
		let file = path.extname(src).slice(1).toLowerCase();
		if (file === "jpg") file = "jpeg";

		let newWidths;
		if (type === "default") {
			newWidths = [100, 900, 1728, 2268, "auto"];
		} else if (type === "screen") {
			newWidths = [100, 1728, "auto"];
		} else if (Number.isInteger(type)) {
			newWidths = [50, type, type * 2];
		}

		const stat = await Image(src, {
			widths: newWidths,
			formats: ["webp", file],
			urlPath: `/static/images/${category}/built`,
			outputDir: `./_site/static/images/${category}/built`,
		});

		const average = await stats(src, "average");
		const loading = Number.isInteger(option) && option < 7 ? "eager" : "lazy";

		const main = stat["webp"];
		const fallback = stat[file];
		const basic = fallback[1];

		let webpset, regset, sizes;

		if (type === "default") {
			const hasXL = main.length >= 5;

			webpset = main
				.slice(hasXL ? 1 : 1, hasXL ? 5 : 4)
				.map((img) => img.srcset)
				.join(", ");
			regset = fallback
				.slice(hasXL ? 1 : 1, hasXL ? 5 : 4)
				.map((img) => img.srcset)
				.join(", ");

			sizes = hasXL
				? `(max-width: 912px) ${main[1].width}px, (min-width: 913px) ${main[2].width}px, (min-width: 1183px) ${main[3].width}px, (min-width: 1549px) ${main[4].width}px`
				: `(max-width: 912px) ${main[1].width}px, (min-width: 913px) ${main[2].width}px, (min-width: 1183px) ${main[3].width}px`;
		} else {
			webpset = `${main[1].url}, ${main[2].url} 2x`;
			regset = `${fallback[1].url}, ${fallback[2].url} 2x`;
		}

		const source = `<source type="image/webp" srcset="${webpset}"${sizes ? ` sizes="${sizes}"` : ""}>`;

		const img = `<img loading="${loading}" decoding="async" alt="${alt}" src="${main[0].url}" srcset="${regset}"${sizes ? ` sizes="${sizes}"` : ""} width="${basic.width}" height="${basic.height}">`;

		const picture = `<picture style="--background: ${average}">${source}${img}</picture>`;

		if (option === "lightbox") {
			const figcaption = figp ?? nbspFilter(2, 100)(alt);
			const caption = `<figcaption id="${name}-caption" aria-hidden="true">${figcaption}</figcaption>`;
			const link = `<a class="expand" href="#${name}-lightbox" aria-label="${alt} Expand image">${picture}</a>`;
			return `<figure id="${name}" aria-labelledby="${name}-caption">${caption}${link}</figure>`;
		}

		return picture;
	} catch (error) {
		console.error("Image:", src, "\n", error, "\n");
	}
};