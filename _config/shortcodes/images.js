import fs from "fs";
import path from "path";
import Image from '@11ty/eleventy-img';
import Sharp from 'sharp';
import EleventyFetch from '@11ty/eleventy-fetch';
import { nbspFilter } from '../filters/posts.js';

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
		let ext;

		if (src.includes("@")) {
			ext = src.split("@").pop().toLowerCase();
		} else {
			const pathname = new URL(src, "http://dummy").pathname;
			const parts = pathname.split(".");
			if (parts.length > 1) {
				ext = parts.pop().toLowerCase();
			} else {
				ext = "";
			}
		}

		switch (ext) {
			case "jpg":
			case "jpe":
			case "jfif":
				return "jpeg";
			case "tif":
				return "tiff";
			case "jpeg":
			case "png":
			case "webp":
			case "gif":
			case "avif":
				return ext;
			default:
				return "jpeg";
		}
	} catch {
		return "jpeg";
	}
};

const cacheFolder = path.join(process.cwd(), ".cache");
const imagesJsonPath = path.join(cacheFolder, "images.json");
if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder, { recursive: true });

const loadImagesJson = () => {
	try {
		if (fs.existsSync(imagesJsonPath)) {
			const content = fs.readFileSync(imagesJsonPath, "utf-8");
			return JSON.parse(content);
		}
	} catch (err) {
		console.error("Error reading images.json", err);
	}
	return [];
};

const saveImagesJson = (data) => {
	fs.writeFileSync(imagesJsonPath, JSON.stringify(data, null, 2), "utf-8");
};

const normalize = (val) => (val > 255 ? val / 257 : val);

export const stats = async (src, type, value) => {
	const defaultColor = "var(--color-dark-grey)";
	const defaultTheme = "dark";

	const images = loadImagesJson();
	let imageEntry = images.find((img) => img.src === src);

	if (!imageEntry) {
		imageEntry = { src };
		images.push(imageEntry);
	}

	const image = src.startsWith("https://") ? await fetchImageBuffer(src) : src;
	const sharpImage = Sharp(image);
	const metadata = await sharpImage.metadata();

	if (!imageEntry.width) imageEntry.width = metadata.width;
	if (!imageEntry.height) imageEntry.height = metadata.height;
	if (!imageEntry.orientation)
		imageEntry.orientation = metadata.width > metadata.height ? "landscape" : "portrait";

	const reduce = (num, den) => {
		const gcd = (a, b) => (b ? gcd(b, a % b) : a);
		const factor = gcd(num, den);
		return [num / factor, den / factor];
	};
	if (!imageEntry.ratio) {
		const [w, h] = reduce(metadata.width, metadata.height);
		imageEntry.ratio = `${w} / ${h}`;
	}

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
		if (!stats.channels || stats.channels.length < 1) return defaultColor;

		if (stats.channels.length === 1) {
			const gray = Math.round(normalize(stats.channels[0].mean));
			return `#${gray.toString(16).padStart(2, "0").repeat(3)}`;
		} else {
			const r = Math.round(normalize(stats.channels[0].mean));
			const g = Math.round(normalize(stats.channels[1].mean));
			const b = Math.round(normalize(stats.channels[2].mean));
			return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
		}
	};

	if ((type === "theme" || type === "color" || type === "both") && !imageEntry.theme) {
		imageEntry.theme = await getTheme();
	}
	if ((type === "average" || type === "color" || type === "both") && !imageEntry.average) {
		imageEntry.average = await getAverage();
	}
	if (type === "color" && !imageEntry.color) {
		imageEntry.color = imageEntry.average;
	}

	saveImagesJson(images);

	if (type === "theme") return imageEntry.theme || defaultTheme;
	if (type === "average") return imageEntry.average || defaultColor;
	if (type === "color" || type === "both")
		return { theme: imageEntry.theme || defaultTheme, average: imageEntry.average || defaultColor };
	if (type === "width") return metadata.width;
	if (type === "height") return metadata.height;
	if (type === "orientation") return imageEntry.orientation || "portrait";
	if (type === "ratio") return imageEntry.ratio;

	return undefined;
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
		console.error("Image (external):", src, "\n", error, "\n");
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
		console.error("Image (OG):", src, "\n", error, "\n");
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
		console.error("Image (image):", src, "\n", error, "\n");
	}
};