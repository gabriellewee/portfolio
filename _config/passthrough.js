module.exports = eleventyConfig => {
	[
		"robots.txt",
		"contact.vcf",
		"static/css/no-js.css",
		"static/fonts",
		"static/css/fonts",
		"static/images",
		"static/code/images"
	].forEach(path =>
		eleventyConfig.addPassthroughCopy(path)
	);

	eleventyConfig.addPassthroughCopy({
		"static/images/favicons": "/",
		"_includes/svg": "static/images/svg",
		"node_modules/clipboard/dist/clipboard.min.js": "static/js/clipboard.min.js",
		"node_modules/gsap/dist/gsap.min.js": "static/js/gsap.min.js",
		"node_modules/gsap/dist/ScrollTrigger.min.js": "static/js/scroll-trigger.min.js",
		"node_modules/gsap/dist/TextPlugin.min.js": "static/js/text.min.js",
		"node_modules/imagesloaded/imagesloaded.pkgd.min.js": "static/js/imagesloaded.min.js",
		"node_modules/infinite-scroll/dist/infinite-scroll.pkgd.min.js": "static/js/infinite-scroll.min.js",
		"node_modules/isotope-layout/dist/isotope.pkgd.min.js": "static/js/isotope.min.js",
		"node_modules/isotope-packery/packery-mode.pkgd.min.js": "static/js/packery.min.js",
		"node_modules/luxon/build/global/luxon.min.js": "static/js/luxon.min.js",
		"node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js": "static/js/smoothscroll.min.js"
	});
};