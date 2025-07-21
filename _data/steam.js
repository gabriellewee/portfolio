import Cache from '@11ty/eleventy-fetch';

export default async function() {
	try {
		// https://cdn.cloudflare.steamstatic.com/steam/apps/0000000/hero_capsule.jpg
		// https://cdn.cloudflare.steamstatic.com/steam/apps/0000000/capsule_616x353.jpg
		// https://cdn.cloudflare.steamstatic.com/steam/apps/0000000/header.jpg
		// https://cdn.cloudflare.steamstatic.com/steam/apps/0000000/capsule_231x87.jpg

		const data = await Cache(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${process.env.STEAM_ID}&format=json`, {
			duration: '1d',
			type: 'json'
		});

		const replacements = JSON.parse(process.env.STEAM_PLAYTESTS || '{}');

		const gamesList = data.response.games.map(game => {
			const appId = replacements[game.appid];
			if (appId) {
				return {
					...game,
					appid: parseInt(appId, 10)
				};
			}
			return game;
		});

		return {
			...data,
			response: {
				...data.response,
				games: gamesList
			}
		};

	} catch(e) {
		console.error(e);
		return [];
	}
};