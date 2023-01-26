const Cache = require('@11ty/eleventy-fetch');

module.exports = async () => {
	try {
		let key = process.env.STEAM_API_KEY;
		let url = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=76561198135921646&format=json`;

		// https://cdn.cloudflare.steamstatic.com/steam/apps/0000000/hero_capsule.jpg
		// https://cdn.cloudflare.steamstatic.com/steam/apps/0000000/capsule_616x353.jpg
		// https://cdn.cloudflare.steamstatic.com/steam/apps/0000000/header.jpg
		// https://cdn.cloudflare.steamstatic.com/steam/apps/0000000/capsule_231x87.jpg

		return Cache(url, {
			duration: '1d',
			type: 'json'
		});
	} catch(e) {
		return [];
	}
};