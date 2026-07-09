import Cache from '@11ty/eleventy-fetch';

const cdnHost = 'https://shared.cloudflare.steamstatic.com';

function fallbackUrl(appId, filename) {
	return `${cdnHost}/store_item_assets/steam/apps/${appId}/${filename}`;
}

function assetUrl(assets, filenameKey, appId, fallbackFilename) {
	const filename = assets && assets[filenameKey];
	if (assets && assets.asset_url_format && filename) {
		return `${cdnHost}/store_item_assets/${assets.asset_url_format.replace('${FILENAME}', filename)}`;
	}
	return fallbackUrl(appId, fallbackFilename);
}

export default async function() {
	try {
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

		let assetsByAppId = {};
		try {
			const input = encodeURIComponent(JSON.stringify({
				ids: gamesList.map(game => ({ appid: game.appid })),
				context: { language: 'english', country_code: 'US', steam_realm: 1 },
				data_request: { include_assets: true }
			}));

			const items = await Cache(`https://api.steampowered.com/IStoreBrowseService/GetItems/v1/?input_json=${input}`, {
				duration: '1d',
				type: 'json'
			});

			assetsByAppId = Object.fromEntries(
				(items.response?.store_items || []).map(item => [item.appid, item.assets])
			);
		} catch(e) {
			console.error('Steam GetItems assets fetch failed, falling back to hashless URLs:', e);
		}

		const games = gamesList.map(game => {
			const assets = assetsByAppId[game.appid];
			return {
				...game,
				poster: assetUrl(assets, 'library_capsule_2x', game.appid, 'library_600x900_2x.jpg')
			};
		});

		return {
			...data,
			response: {
				...data.response,
				games
			}
		};

	} catch(e) {
		console.error(e);
		return [];
	}
};
