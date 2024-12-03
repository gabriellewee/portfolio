import Cache from '@11ty/eleventy-fetch';

export default async function() {
	try {
		return Cache(`https://api.notion.com/v1/databases/${process.env.NOTION_SWITCH}/query`, {
			directory: ".cache",
			duration: '1d',
			type: 'json',
			fetchOptions: {
				method: 'POST',
				body: JSON.stringify({
					filter: {
						property: "Archive",
						checkbox: {
							equals: false
						}
					}
				}),
				headers: {
					'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
					'Notion-Version': '2022-06-28',
					'Content-Type': 'application/json'
				}
			}
		});
	} catch(e) {
		console.error(e);
		return [];
	}
};