const Cache = require('@11ty/eleventy-fetch');

module.exports = async () => {
	try {
		let url = "https://webmention.io/api/mentions.json?token=oAQHqxdBDRtLHRk2g4aU-Q";

		return Cache(url, {
			duration: '1d',
			type: 'json'
		});
	} catch(e) {
		return [];
	}
};