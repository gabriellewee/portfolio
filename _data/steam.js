import Cache from '@11ty/eleventy-fetch';

export default async function() {
	try {
		// https://cdn.cloudflare.steamstatic.com/steam/apps/0000000/hero_capsule.jpg
		// https://cdn.cloudflare.steamstatic.com/steam/apps/0000000/capsule_616x353.jpg
		// https://cdn.cloudflare.steamstatic.com/steam/apps/0000000/header.jpg
		// https://cdn.cloudflare.steamstatic.com/steam/apps/0000000/capsule_231x87.jpg

		return Cache(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=76561198135921646&format=json`, {
			duration: '1d',
			type: 'json'
		});
	} catch(e) {
		console.error(e);
		return [];
	}
};