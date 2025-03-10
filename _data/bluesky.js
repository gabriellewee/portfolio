import Cache from '@11ty/eleventy-fetch';

export default async function() {
	try {
		return Cache(`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${process.env.BLUESKY_USERNAME}&filter=posts_and_author_threads`, {
			duration: '1d',
			type: 'json'
		});
	} catch(e) {
		console.error(e);
		return [];
	}
};