import Image from '@11ty/eleventy-img';
import nbspFilter from 'eleventy-nbsp-filter';
import { stats as getStats, findExtension } from '../shortcodes/images.js'

export const images = async (post, option) => {
	const pattern = /<\s*p><img src="(?<src>[^<]*)" alt="(?<alt>[^<]*)" title="(?<title>[^<]*)"><\/p>/g;
	const matches = post.matchAll(pattern);
	let lightboxes = "";

	if (!matches) return post;

	for (const image of matches) {
		const src = image.groups.src;
		const url = `./static/images/posts/${src}`;
		const alt = image.groups.alt;
		const title = image.groups.title;
		const name = src.split(".")[0];
		const file = findExtension(src);

		const { theme, average } = await getStats(url, "color", "top left");

		if (file === "svg") {
			const metadata = await Image(url, { widths: [null], statsOnly: true });
			const width = metadata.webp?.[0]?.width ?? 100;
			const height = metadata.webp?.[0]?.height ?? 100;

			const picture = `<picture><img style="--background: ${average}" src="/static/images/posts/${src}" alt="${alt}" width="${width}" height="${height}"/></picture>`;

			if (option === "lightbox") {
				const figure = `
					<a class="lightbox" id="${name}-lightbox" role="button" aria-label="Close image" href="#${name}" data-lightbox></a>
					<dialog class="lightbox-content image" aria-label="Image preview" autofocus>
						<figure>${picture}</figure>
					</dialog>`;
				lightboxes += figure;
			} else {
				const caption = `<figcaption>${title}</figcaption>`;
				const link = `<a class="expand ${theme}" href="#${name}-lightbox" aria-label="${alt} Expand image" data-media-expand>${picture}</a>`;
				const figure = `<figure id="${name}">${caption}${link}</figure>`;
				post = post.replace(image[0], figure);
			}
			continue;
		}

		const widths = option === "lightbox"
			? [100, 1728, "auto"]
			: [100, 900, 1728, 2268, "auto"];

		const stats = await Image(url, {
			widths,
			formats: ["webp", file],
			urlPath: `/static/images/posts/built`,
			outputDir: `./_site/static/images/posts/built`
		});

		const basic = stats[file][1];
		const main = stats["webp"];
		const fallback = stats[file];

		const buildSrcSet = (imgs, max = imgs.length - 1) =>
			imgs.slice(1, max + 1).map(img => img.srcset || `${img.url} 2x`).join(", ");

		const webpset = buildSrcSet(main);
		const regset = buildSrcSet(fallback);

		const sizes = main.length >= 5
			? `(max-width: 912px) ${main[1].width}px, (min-width: 913px) ${main[2].width}px, (min-width: 1183px) ${main[3].width}px, (min-width: 1549px) ${main[4].width}px`
			: main.length >= 4
			? `(max-width: 912px) ${main[1].width}px, (min-width: 913px) ${main[2].width}px, (min-width: 1183px) ${main[3].width}px`
			: undefined;

		const source = `<source type="image/webp" srcset="${webpset}"${sizes ? ` sizes="${sizes}"` : ""}>`;
		const img = `<img style="--background: ${average}" loading="lazy" decoding="async" alt="${alt}" src="${main[0].url}" srcset="${regset}"${sizes ? ` sizes="${sizes}"` : ""} width="${basic.width}" height="${basic.height}">`;
		const picture = `<picture>${source}${img}</picture>`;

		if (option === "lightbox") {
			const figure = `
				<a class="lightbox" id="${name}-lightbox" role="button" aria-label="Close image" href="#${name}" data-lightbox></a>
				<dialog class="lightbox-content image" aria-label="Image preview" autofocus>
					<figure>${picture}</figure>
				</dialog>`;
			lightboxes += figure;
		} else {
			const caption = `<figcaption id="${name}-caption" aria-hidden="true">${nbspFilter(2, 100)(title)}</figcaption>`;
			const linkOrPlain = (main.length >= 4)
				? `<a class="expand ${theme}" href="#${name}-lightbox" aria-label="${alt} Expand image" data-media-expand>${picture}</a>`
				: picture;
			const figure = `<figure id="${name}" aria-labelledby="${name}-caption">${caption}${linkOrPlain}</figure>`;
			post = post.replace(image[0], figure);
		}
	}

	return option === "lightbox" ? lightboxes : post;
};