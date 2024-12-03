import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItContainer from 'markdown-it-container';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItTasks from 'markdown-it-task-checkbox';
import string from 'string';

export const markdownLibrary = markdownIt({
	html: true,
	breaks: true,
	linkify: true,
	typographer: true
}).use(markdownItAnchor, {
	slugify: s => string(s).slugify().toString(),
	permalink: markdownItAnchor.permalink.ariaHidden({
		class: "direct-link",
		symbol: "",
		placement: "after",
		renderAttrs: (s) => ({ 'data-anchor': '', 'aria-label': 'Jump link to heading' })
	})
}).use(markdownItContainer, 'dynamic', {
	validate: function() { return true; },
	render: function(tokens, idx) {
		var token = tokens[idx];

		if (token.nesting === 1) {
			return '<div class="' + token.info.trim() + '">';
		} else {
			return '</div>';
		}
	},
}).use(markdownItAttrs).use(markdownItTasks, {disabled: false, idPrefix: "task-list-checkbox-"});