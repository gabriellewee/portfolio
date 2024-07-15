const Cache = require('@11ty/eleventy-fetch');

module.exports = async () => {
	try {
		return Cache("https://front-end.social/api/v1/accounts/110827735972976242/statuses?limit=40&exclude_replies=true&exclude_reblogs=true", {
			duration: '1d',
			type: 'json',
			fetchOptions: {
				headers: {
					'Authorization': `Bearer ${process.env.MASTODON_API_KEY}`
				}
			}
		});
	} catch(e) {
		console.error(e);
		return [];
	}
};