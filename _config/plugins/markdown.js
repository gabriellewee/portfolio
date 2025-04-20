import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItContainer from "markdown-it-container";
import markdownItAttrs from "markdown-it-attrs";
import markdownItTasks from "markdown-it-task-checkbox";
import voca from "voca";

const slugify = (s) => voca.slugify(s);

const anchorPermalink = markdownItAnchor.permalink.ariaHidden({
	class: "direct-link",
	symbol: "",
	placement: "after",
	renderAttrs: () => ({
		"data-anchor": "",
		"aria-label": "Jump link to heading",
	}),
});

const containerOptions = {
	validate: () => true,
	render: (tokens, idx) =>
		tokens[idx].nesting === 1
			? `<div class="${tokens[idx].info.trim()}">`
			: "</div>",
};

export const markdownLibrary = markdownIt({
	html: true,
	breaks: true,
	linkify: true,
	typographer: true,
})
	.use(markdownItAnchor, {
		slugify,
		permalink: anchorPermalink,
	})
	.use(markdownItContainer, "dynamic", containerOptions)
	.use(markdownItAttrs)
	.use(markdownItTasks, {
		disabled: false,
		idPrefix: "task-list-checkbox-",
	});