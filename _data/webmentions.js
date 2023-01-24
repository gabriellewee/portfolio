const Cache = require('@11ty/eleventy-fetch');

module.exports = async () => {
	try {
		let key = process.env.WEBMENTION_IO_KEY;
		let url = `https://webmention.io/api/mentions.json?token=${key}&per-page=90001`;

		return Cache(url, {
			duration: '1d',
			type: 'json'
		});
	} catch(e) {
		return [];
	}
};