import Cache from '@11ty/eleventy-fetch';

export default async function() {
	try {
		return Cache(`https://webmention.io/api/mentions.json?token=${process.env.WEBMENTION_IO_KEY}&per-page=90001`, {
			duration: '1d',
			type: 'json'
		});
	} catch(e) {
		console.error(e);
		return [];
	}
};