const Cache = require('@11ty/eleventy-fetch');

module.exports = async () => {
	try {
		let key = process.env.NOTION_API_KEY;
		let games = process.env.NOTION_SWITCH;
		let url = `https://api.notion.com/v1/databases/${games}/query`;

		return Cache(url, {
			directory: ".cache",
			duration: '1d',
			type: 'json',
			fetchOptions: {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${key}`,
					'Notion-Version': '2022-02-22',
					'Content-Type': 'application/json'
				}
			}
		});
	} catch(e) {
		return [];
	}
};