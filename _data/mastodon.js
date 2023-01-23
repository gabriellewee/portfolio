const Cache = require('@11ty/eleventy-fetch');

module.exports = async () => {
	try {
		let key = process.env.MASTODON_API_KEY;
		let url = "https://mas.to/api/v1/accounts/109501918064521028/statuses";

		return Cache(url, {
			duration: '1d',
			type: 'json',
			fetchOptions: {
				headers: {
					'Authorization': `Bearer ${key}`
				}
			}
		});
	} catch(e) {
		return [];
	}
};