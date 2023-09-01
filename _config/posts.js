const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const string = require("string");

module.exports = eleventyConfig => {
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(syntaxHighlight);

	let markdownLibrary = markdownIt({
		html: true,
		breaks: true,
		linkify: true,
		typographer: true
	}).use(markdownItAnchor, {
		slugify: s => string(s).slugify().toString(),
		permalink: markdownItAnchor.permalink.ariaHidden({
			class: "direct-link",
			symbol: "¶",
			placement: "after"
		})
	});
	eleventyConfig.setLibrary("md", markdownLibrary);

	eleventyConfig.addFilter("stripAttr", stripped => {
		let removals = /<div class="lightbox-group" hidden>([\s\S]*?)<\/div>|<figure class="animation">([\s\S]*?)<\/figure>|<\/?a class="expand"[^>]*>|<\/?span[^>]*>|<\/?picture[^>]*>|<\/?source[^>]*>|<\/?div[^>]*>|<\/?script[^>]*>|\t|\r|\n/g;
		stripped = stripped.replace(removals, '');
		stripped = stripped
			.replace(/<\s*p .*?data-slug-hash="([^<]*)" data-default.*?>[^<]*<\s*a.*?>[^<]*<\/p>/g, '<iframe src="https://codepen.io/gabriellewee/embed/$1">')
			.replace(/<\s*img loading="lazy" decoding="async"/g, '<img')
			.replace(/src="data:image\/png;base64,[\s\S]*?" srcset="[\s\S]*?" sizes="[\s\S]*?" data-src="([^<]*)"/g, 'src="$1"')
			.replace(/( <a class="direct-link" href="[\s\S]*?">¶<\/a>)/g, '')
			.replace(/<\s*h(\d).*?>/g, '<h$1>')
			.replace(/<\s*figure.*?>/g, '<figure>')
			.replace(/<\s*figcaption.*?>/g, '<figcaption>')
			.replace(/<\s*pre.*?>/g, '<pre>')
			.replace(/<\s*code.*?>/g, '<code>');
		return stripped;
	});

	eleventyConfig.addFilter("platform", platform => {
		platform = platform.split('/')[4];
		platform = platform.charAt(0).toUpperCase() + platform.slice(1);
		if(platform == "") {
			return;
		} else {
			return `<span> on ${platform}</span>`;
		}
	});
	
	eleventyConfig.addFilter("stripEmpty", post => {
		post = post.replace('</figure></p>', '</figure>');
		return post;
	});

	eleventyConfig.addFilter("removeEmoji", name => {
		name = name.replace(/ :(.*?):$/g, '');
		return name;
	});

	eleventyConfig.addShortcode('excerpt', post => {
		if (!post.hasOwnProperty('templateContent')) {
			console.warn('❌ Failed to extract excerpt: Document has no property `templateContent`.');
			return;
		}

		const excerptSeparator = '<!--more-->';
		const content = post.templateContent.replace('</figure></p>', '</figure>');

		if (content.includes(excerptSeparator)) {
			return content.substring(0, content.indexOf(excerptSeparator)).trim();
		}

		const pCloseTag = '</p>';
		if (content.includes(pCloseTag)) {
			return content.substring(0, content.indexOf(pCloseTag) + pCloseTag.length);
		}

		return content;
	});
};