import { images } from '../filters/images.js';
import nbspFilter from 'eleventy-nbsp-filter';

export const excerpt = async (post, option) => {
	if (!post.hasOwnProperty('templateContent')) {
		console.warn('❌ Failed to extract excerpt: Document has no property `templateContent`.');
		return;
	}

	let excerptSeparator = '<!--more-->';
	let content = post.templateContent;
	let pCloseTag = '</p>';

	let nbsp = nbspFilter(2, 100);
	let excerpt;
	let final;

	if (content.includes(excerptSeparator)) {
		let copy = nbsp(content.substring(0, content.indexOf(excerptSeparator)).trim());
		excerpt = await images(copy, option);
	} else if (content.includes(pCloseTag)) {
		let copy = nbsp(content.substring(0, content.indexOf(pCloseTag) + pCloseTag.length));
		excerpt = await images(copy, option);
	}

	if (option === 'lightbox' && typeof final !== 'undefined') {
		final = excerpt.replace(/<p>([\s\S]*?)<\/p>/g, '');
	} else {
		final = excerpt;
	}

	if (typeof final !== 'undefined') {
		return await final;
	} else {
		return '';
	}
};