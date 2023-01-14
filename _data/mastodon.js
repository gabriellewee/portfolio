const Cache = require('@11ty/eleventy-fetch');

/**
 * Grabs the remote data and returns back an array of objects
 *
 * @returns {Array} Empty or array of objects
 */

module.exports = async () => {
	try {
		let url = "https://mas.to/api/v1/accounts/109501918064521028/statuses";

		/* This returns a promise */
		return Cache(url, {
			duration: '1d', // 1 day
			type: 'json',
			fetchOptions: {
				headers: {
					'Authorization': "Bearer 9OjnoQDxUYS6OAnSZxSusugqLTMMHU7qTsXUa1larBs",
					'Content-Type': "application/json"
				}
			}
		});
	} catch(e) {
		return [];
	}
};