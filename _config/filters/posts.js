import markdownIt from "markdown-it";

const markdown = markdownIt({
	html: true,
	breaks: true,
	linkify: true,
	typographer: true,
});

export const limit = (array, count) => array.slice(0, count);

export const index = (array, i) => array.slice(i - 1, i);

export const isoFilter = (filters) =>
	filters.split(" ").map((el) => `filter-${el}`).join(" ");

export const removeEmoji = (name) => name.replace(/ :(.*?):$/, "");

export const platform = (url = "") => {
	const platform = url.split("/")[4] || "";
	return platform
		? `<span> on ${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>`
		: "";
};

export const md = (copy) => markdown.render(copy);

export const stripAttr = (stripped) => {
	const removals = /<div class="lightbox-group" data-lightbox-container hidden>([\s\S]*?)<\/div>|<\/?a class="expand"[^>]*>|<\/?span[^>]*>|<\/?picture[^>]*>|<\/?source[^>]*>|<\/?div[^>]*>|<\/?script[^>]*>|\t|\r|\n/g;
	return stripped
		.replace(removals, '')
		.replace(/<\s*p .*?data-slug-hash="([^<]*)" data-default.*?>[^<]*<\s*a.*?>[^<]*<\/p>/g, '<iframe src="https://codepen.io/gabriellewee/embed/$1">')
		.replace(/( <a class="direct-link" href="[\s\S]*?">¶<\/a>)/g, '')
		.replace(/<\s*p><img src="(?<src>[^<]*)" alt="(?<alt>[^<]*)" title="(?<title>[^<]*)"><\/p>/g, '<figure><figcaption>$3</figcaption><picture><img src="https://gabriellew.ee/static/images/posts/$1" alt="$2"/></picture></figure>')
		.replace(/<\s*h(\d).*?>/g, '<h$1>')
		.replace(/<\s*figure.*?>/g, '<figure>')
		.replace(/<\s*figcaption.*?>/g, '<figcaption>')
		.replace(/<\s*pre.*?>/g, '<pre>')
		.replace(/<\s*code.*?>/g, '<code>');
};