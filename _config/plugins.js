// external
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import feedPlugin from '@11ty/eleventy-plugin-rss';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

// custom
import { markdownLibrary } from './plugins/markdown.js';

export default {
	eleventyNavigationPlugin,
	feedPlugin,
	syntaxHighlight,
	markdownLibrary
};