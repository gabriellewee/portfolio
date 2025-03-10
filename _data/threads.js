import Cache from '@11ty/eleventy-fetch';

export default async function() {
	// https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=${process.env.THREADS_TOKEN}
	try {
		return Cache(`https://graph.threads.net/v1.0/me/threads?fields=id,media_type,media_url,alt_text,permalink,username,text,timestamp,thumbnail_url,children,is_quote_post,link_attachment_url&access_token=${process.env.THREADS_TOKEN}`, {
			duration: '1d',
			type: 'json'
		});
	} catch(e) {
		console.error(e);
		return [];
	}
};