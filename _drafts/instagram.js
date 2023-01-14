const Cache = require('@11ty/eleventy-fetch');

/**
 * Grabs the remote data and returns back an array of objects
 *
 * @returns {Array} Empty or array of objects
 */

module.exports = async () => {
	try {
		let url = "https://v1.nocodeapi.com/gabriellewee/instagram/jBWnAppvmbbZICNX";

		/* This returns a promise */
		return Cache(url, {
			duration: '1d', // 1 day
			type: 'json'
		});
	} catch(e) {
		return [];
	}
};