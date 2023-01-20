const Cache = require('@11ty/eleventy-fetch');

module.exports = async () => {
	try {
		let url = "https://mas.to/api/v1/accounts/109501918064521028/statuses";

		return Cache(url, {
			duration: '1d',
			type: 'json',
			fetchOptions: {
				headers: {
					'Authorization': "Bearer 9OjnoQDxUYS6OAnSZxSusugqLTMMHU7qTsXUa1larBs"
				}
			}
		});
	} catch(e) {
		return [];
	}
};