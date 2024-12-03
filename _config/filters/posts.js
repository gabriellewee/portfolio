export const limit = (array, limit) => array.slice(0, limit);

export const index = (array, index) => array.slice(index - 1, index);

export const isoFilter = (filters) => {
	let array = filters.split(' ');
	let result = array.map(el => 'filter-' + el);
	return result.join(' ');
};

export const removeEmoji = (name) => name.replace(/ :(.*?):$/g, '');

export const platform = (platform) => {
	platform = platform.split('/')[4];
	platform = platform.charAt(0).toUpperCase() + platform.slice(1);
	if (platform == "") {
		return;
	} else {
		return `<span> on ${platform}</span>`;
	}
};

export const stripAttr = (stripped) => {
	let removals = /<div class="lightbox-group" data-lightbox-container hidden>([\s\S]*?)<\/div>|<\/?a class="expand"[^>]*>|<\/?span[^>]*>|<\/?picture[^>]*>|<\/?source[^>]*>|<\/?div[^>]*>|<\/?script[^>]*>|\t|\r|\n/g;
	stripped = stripped.replace(removals, '');
	stripped = stripped
		.replace(/<\s*p .*?data-slug-hash="([^<]*)" data-default.*?>[^<]*<\s*a.*?>[^<]*<\/p>/g, '<iframe src="https://codepen.io/gabriellewee/embed/$1">')
		.replace(/( <a class="direct-link" href="[\s\S]*?">¶<\/a>)/g, '')
		.replace(/<\s*p><img src="(?<src>[^<]*)" alt="(?<alt>[^<]*)" title="(?<title>[^<]*)"><\/p>/g, '<figure><figcaption>$3</figcaption><picture><img src="https://gabriellew.ee/static/images/posts/$1" alt="$2"/></picture></figure>')
		.replace(/<\s*h(\d).*?>/g, '<h$1>')
		.replace(/<\s*figure.*?>/g, '<figure>')
		.replace(/<\s*figcaption.*?>/g, '<figcaption>')
		.replace(/<\s*pre.*?>/g, '<pre>')
		.replace(/<\s*code.*?>/g, '<code>');
	return stripped;
};