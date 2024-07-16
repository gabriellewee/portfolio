const { Client } = require("@notionhq/client");
const Cache = require("@11ty/eleventy-fetch");
const { NotionToMarkdown } = require("notion-to-md");

module.exports = async () => {
	try {
		let key = process.env.NOTION_API_KEY;

		const notion = new Client({
			auth: key,
		});
		const n2m = new NotionToMarkdown({ notionClient: notion });

		const db = await Cache(`https://api.notion.com/v1/databases/${process.env.NOTION_RECIPES}/query`, {
			duration: '1d',
			type: 'json',
			fetchOptions: {
				method: 'POST',
				withCredentials: true,
				credentials: "include",
				body: JSON.stringify({
					filter: {
						property: "Status",
						status: {
							equals: "Complete",
						},
					},
					sorts: [
						{
							property: "Date",
							direction: "descending",
						},
					],
				}),
				headers: {
					Authorization: `Bearer ${key}`,
					"Notion-Version": "2022-06-28",
					"Content-Type": "application/json",
				}
			}
		});

		const getContent = async (id) => {
			let blocks = await n2m.pageToMarkdown(id);
			let excerpt = blocks[0].parent;
			let content = n2m.toMarkdownString(blocks).parent;
			return {
				excerpt: excerpt,
				content: content,
			};
		};

		const tags = (list) => {
			let taglist = [];
			for (i = 0; i < list.length; i++) {
				taglist.push(list[i].name);
			}
			return taglist;
		};

		const posts = db.results.map((result) => ({
			id: result.id,
			date: result.properties["Date"]?.date?.start,
			title: result.properties["Title"].title[0].plain_text,
			excerpt: undefined,
			content: undefined,
			tags: tags(result.properties["Tags"]?.multi_select),
			icon: result.icon.emoji,
			servings: result.properties["Servings"]?.number,
			prep: result.properties["Prep"]?.number,
			cook: result.properties["Cook"]?.number
		}));

		for (i = 0; i < posts.length; i++) {
			const post = await getContent(posts[i].id);
			posts[i].content = post.content;
			posts[i].excerpt = post.excerpt;
		}

		return posts;
	} catch(e) {
		console.error(e);
		return [];
	}
};