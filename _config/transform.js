const sass = require("sass");
const path = require("path");
const minify = require("terser").minify;
const htmlmin = require("html-minifier");

module.exports = eleventyConfig => {
	eleventyConfig.addTransform("minify", async (content, outputPath) => {
		if (outputPath && outputPath.endsWith(".html")) {
			return await htmlmin.minify(content, {
				collapseWhitespace: true,
				removeComments: true,  
				useShortDoctype: true,
			});
	    }
	    return content;
	});

	eleventyConfig.addTemplateFormats("js");
	eleventyConfig.addExtension("js", {
		outputFileExtension: "js",
		compile: (inputContent, inputPath) => {
			let parsed = path.parse(inputPath);
			if (parsed.name.startsWith(".")) {
				return;
			}
			return async (data) => {
				let minified = await minify(inputContent, {});
				return minified.code;
			};
		}
	});

	eleventyConfig.addTemplateFormats("scss");
	eleventyConfig.addExtension("scss", {
		outputFileExtension: "css",
		compile: (inputContent, inputPath) => {
			let parsed = path.parse(inputPath);
			if (parsed.name.startsWith("_")) {
				return;
			}
			return async (data) => {
				let result = sass.compileString(inputContent, {
					style: "compressed",
					loadPaths: [
						parsed.dir || "."
					]
				});
				return result.css.toString("utf8");
			};
		}
	});
};