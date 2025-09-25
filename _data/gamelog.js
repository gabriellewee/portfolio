import Cache from '@11ty/eleventy-fetch';

export default async function() {
	try {
		const response = await Cache(`https://api.notion.com/v1/data_sources/${process.env.NOTION_GAMELOG}/query`, {
			directory: ".cache",
			duration: '1d',
			type: 'json',
			fetchOptions: {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
					'Notion-Version': '2025-09-03',
					'Content-Type': 'application/json'
				}
			}
		});

		return response.results || [];
	} catch(e) {
		console.error(e);
		return [];
	}
};