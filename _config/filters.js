import { date, year, iso } from './filters/dates.js';
import { images } from './filters/images.js';
import { limit, index, isoFilter, removeEmoji, platform, md, stripAttr, nbspFilter } from './filters/posts.js';

export default {
	nbspFilter,
	date, year, iso,
	images,
	limit, index, isoFilter, removeEmoji, platform, md, stripAttr
};