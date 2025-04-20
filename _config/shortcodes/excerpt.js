import { images } from "../filters/images.js";
import nbspFilter from "eleventy-nbsp-filter";

export const excerpt = async (post, option) => {
	if (!post?.templateContent) return "";

	const content = post.templateContent;
	const separator = "<!--more-->";
	const pClose = "</p>";
	const nbsp = nbspFilter(2, 100);

	let copy;

	if (content.includes(separator)) {
		copy = content.substring(0, content.indexOf(separator)).trim();
	} else if (content.includes(pClose)) {
		copy = content.substring(0, content.indexOf(pClose) + pClose.length);
	} else {
		return "";
	}

	let excerpt = await images(nbsp(copy), option);

	if (option === "lightbox" && typeof excerpt === "string") {
		excerpt = excerpt.replace(/<p>([\s\S]*?)<\/p>/g, "");
	}

	return excerpt;
};