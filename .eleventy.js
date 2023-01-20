module.exports = eleventyConfig => {
	eleventyConfig.addPlugin(require('./_config/passthrough.js'));
	eleventyConfig.addPlugin(require('./_config/transform.js'));
	eleventyConfig.addPlugin(require('./_config/filters.js'));
	eleventyConfig.addPlugin(require('./_config/posts.js'));
	eleventyConfig.addPlugin(require('./_config/images.js'));
	eleventyConfig.addPlugin(require('./_config/watch.js'));

	return {
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid"
		],
		markdownTemplateEngine: "liquid",
		htmlTemplateEngine: "njk",
		dataTemplateEngine: "njk",
	};
};
