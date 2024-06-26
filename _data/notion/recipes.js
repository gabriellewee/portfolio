const Cache = require('@11ty/eleventy-fetch');
// const fetchBlocks = require("../../_helpers/fetchBlocks");

module.exports = async () => {
	try {
		let key = process.env.NOTION_API_KEY;
		let recipes = process.env.NOTION_SWITCH;
		let url = `https://api.notion.com/v1/databases/${recipes}/query`;

		let db = Cache(url, {
			directory: ".cache",
			duration: '1m',
			type: "json",
			fetchOptions: {
				method: "POST",
				headers: {
					'Authorization': `Bearer ${key}`,
					'Notion-Version': '2022-02-22',
					'Content-Type': 'application/json'
				},
			}
		});

		// let posts = db.results;

		// for (i = 0; i < posts.length; i++) {
		// 	let id = posts[i].id.replaceAll("-", "");
		// 	let blocks = await fetchBlocks(posts[i].id, [], null, skipCache);
		// 	let post = await getContent(blocks);
		// 	posts[i].excerpt = post.excerpt;
		// 	posts[i].excerptPlain = post.excerptPlain;
		// 	posts[i].content = post.content;
		// }

		return db;
	} catch(e) {
		return [];
	}
};