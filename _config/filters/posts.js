import markdownIt from "markdown-it";
import path from 'path';
import fs from 'fs';

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

export const demo = (slug, lang) => {
	let filePath;

	if(lang == "html") {
		filePath = path.join(process.cwd(), 'code', `${slug}.njk`);
	} else if(lang =="scss") {
		filePath = path.join(process.cwd(), 'static/code/css', `${slug}.scss`);
	} else {
		filePath = path.join(process.cwd(), 'static/code/', `${lang}/`, `${slug}.${lang}`);
	}

	const stripFrontMatter = (content) => { return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ''); };

	const raw = fs.readFileSync(filePath, 'utf8');
	const clean = stripFrontMatter(raw);
	const code = clean.split('\n').filter(l => !l.includes('demo:hide')).join('\n').trim();

	return code;
};

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

export const nbspFilter = (words = 2, maxLength = 100) => (value = "") => {
	if (typeof value !== "string") return value;

	const parts = value.split(" ");
	if (parts.length <= words) return value;

	const pre = parts.slice(0, -words);
	const last = parts.slice(-words).join("\u00A0");

	return last.length <= maxLength ? [...pre, last].join(" ") : value;
};

export const description = (content) => {
	if (!content || typeof content !== "string") return "";

	const copy = content
		.replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, " ")
		.replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi, " ")
		.replace(/<img\b[^>]*>/gi, " ")
		.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1")
		.replace(/<\/(?:p|div|section|article|blockquote|li|h[1-6])>/gi, " ")
		.replace(/<br\s*\/?>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&quot;/gi, '"')
		.replace(/&#(?:39|x27);|&apos;/gi, "'")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/\s+/g, " ")
		.trim();

	if (!copy) return "";

	return [...new Intl.Segmenter("en", {
		granularity: "sentence",
	}).segment(copy)]
		.slice(0, 2)
		.map(({ segment }) => segment.trim())
		.join(" ");
};