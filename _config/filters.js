// external
import nbspFilter from 'eleventy-nbsp-filter';

// custom
import { date, year, iso } from './filters/dates.js';
import { images } from './filters/images.js';
import { limit, index, isoFilter, removeEmoji, platform, stripAttr } from './filters/posts.js';

export default {
	nbspFilter,
	date, year, iso,
	images,
	limit, index, isoFilter, removeEmoji, platform, stripAttr
};