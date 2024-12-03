import Image from '@11ty/eleventy-img';
import nbspFilter from 'eleventy-nbsp-filter';

export const images = async (post, option) => {
	let pattern = /<\s*p><img src="(?<src>[^<]*)" alt="(?<alt>[^<]*)" title="(?<title>[^<]*)"><\/p>/g;
	let lightboxes = "";
	let images = post.matchAll(pattern);
	if (images) {
		for (const image of images) {
			let src = image.groups.src;
			let url = `./static/images/posts/${src}`;
			let alt = image.groups.alt;
			let title = image.groups.title;
			let name = src.split(".")[0];
			let file = src.split(".")[1];
			if (file === "jpg") file = "jpeg";

			if (file === "svg") {
				let stats = await Image(url, {
					widths: [null],
					statsOnly: true
				});
				let width = stats["webp"][0].width;
				let height = stats["webp"][0].height;

				if (option === "lightbox") {
					let figure = `
						<a class="lightbox" id="${name}-lightbox" role="button" aria-label="Close image" href="#${name}" data-lightbox></a>
						<dialog class="image" aria-label="Image preview" autofocus>
							<figure>
								<picture>
									<img src="/static/images/posts/${src}" alt="${alt}" width="${width}" height="${height}"/>
								</picture>
							</figure>
						</dialog>
					`;
					lightboxes = lightboxes.concat(figure);
				} else {
					let figure = `
						<figure id="${name}">
							<figcaption>${title}</figcaption>
							<a class="expand" href="#${name}-lightbox" aria-role="button" aria-label="${alt} Expand image">
								<picture>
									<img src="/static/images/posts/${src}" alt="${alt}" width="${width}" height="${height}"/>
								</picture>
							</a>
						</figure>
					`;
					post = post.replace(image[0], figure);
				}
			} else {
				let newWidths;

				if (option === "lightbox") {
					newWidths = [100, 1728, "auto"];
				} else {
					newWidths = [100, 900, 1728, 2268, "auto"];
				}

				let stats = await Image(url, {
					widths: newWidths,
					formats: ["webp", file],
					urlPath: `/static/images/posts/built`,
					outputDir: `./_site/static/images/posts/built`,
				});

				let lowest = stats[file][0];
				let basic = stats[file][1];

				let webpset;
				let regset;
				let source;
				let img;
				let completed;

				if (option === "lightbox") {
					if (stats["webp"][2]) {
						webpset = `${stats["webp"][1].url}, ${stats["webp"][2].url} 2x`;
						regset = `${stats[file][1].url}, ${stats[file][2].url} 2x`;
						source = `<source type="image/webp" srcset="${webpset}">`;
						img = `<img loading="lazy" decoding="async" alt="${alt}" src="${stats["webp"][0].url}" srcset="${regset}" width="${basic.width}" height="${basic.height}">`;

						let picture = `<picture>${source}${img}</picture>`;
						let figure = `
							<a class="lightbox" id="${name}-lightbox" role="button" aria-label="Close image" href="#${name}" data-lightbox></a>
							<dialog class="lightbox-content image" aria-label="Image preview" autofocus>
								<figure>${picture}</figure>
							</dialog>
						`;

						lightboxes = lightboxes.concat(figure);
					}
				} else {
					if (stats["webp"][4]) {
						webpset = `${stats["webp"][4].srcset}, ${stats["webp"][3].srcset}, ${stats["webp"][2].srcset}, ${stats["webp"][1].srcset}`;
						regset = `${stats[file][4].srcset}, ${stats[file][3].srcset}, ${stats[file][2].srcset}, ${stats[file][1].srcset}`;
						source = `<source type="image/webp" srcset="${webpset}" sizes="${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px, (min-width: 1549px) ${stats["webp"][4].width}px">`;
						img = `<img loading="lazy" decoding="async" alt="${alt}" src="${stats["webp"][0].url}" srcset="${regset}" sizes="${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px, (min-width: 1549px) ${stats["webp"][4].width}px" width="${basic.width}" height="${basic.height}">`;
					} else if (stats["webp"][3]) {
						webpset = `${stats["webp"][3].srcset}, ${stats["webp"][2].srcset}, ${stats["webp"][1].srcset}`;
						regset = `${stats[file][3].srcset}, ${stats[file][2].srcset}, ${stats[file][1].srcset}`;
						source = `<source type="image/webp" srcset="${webpset}" sizes="${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px">`;
						img = `<img loading="lazy" decoding="async" alt="${alt}" src="${stats["webp"][0].url}" srcset="${regset}" sizes="${stats["webp"][1].width}px, (min-width: 913px) ${stats["webp"][2].width}px, (min-width: 1183px) ${stats["webp"][3].width}px" width="${basic.width}" height="${basic.height}">`;
					} else {
						webpset = `${stats["webp"][1].url}`;
						regset = `${stats[file][1].url}`;
						source = `<source type="image/webp" srcset="${webpset}">`;
						img = `<img loading="lazy" decoding="async" alt="${alt}" src="${stats["webp"][0].url}" srcset="${regset}" width="${basic.width}" height="${basic.height}">`;
					}

					let picture = `<picture>${source}${img}</picture>`;
					let nbsp = nbspFilter(2, 100);
					let figure;

					if (stats["webp"][4] || stats["webp"][3]) {
						let caption = `<figcaption id="${name}-caption" aria-hidden="true">${nbsp(title)}</figcaption>`;
						let link = `<a class="expand" href="#${name}-lightbox" aria-label="${alt} Expand image" data-media-expand>${picture}</a>`;
						figure = `<figure id="${name}" aria-labelledby="${name}-caption">${caption}${link}</figure>`;
					} else {
						let caption = `<figcaption id="${name}-caption" aria-hidden="true">${nbsp(title)}</figcaption>`;
						figure = `<figure id="${name}" aria-labelledby="${name}-caption">${caption}${picture}</figure>`;
					}
					post = post.replace(image[0], figure);
				}
			}
		}
	}

	if (option === "lightbox") {
		return lightboxes;
	} else {
		return post;
	}
};