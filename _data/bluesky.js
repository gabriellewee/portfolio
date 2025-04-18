import Cache from "@11ty/eleventy-fetch";

const byteRangeToCharRange = (text, byteStart, byteEnd) => {
	const encoder = new TextEncoder();
	let bytePos = 0;
	let charIndex = 0;
	const byteToCharIndex = [];

	for (const char of text) {
		const bytes = encoder.encode(char);
		for (let i = 0; i < bytes.length; i++) {
			byteToCharIndex[bytePos++] = charIndex;
		}
		charIndex++;
	}

	const start = byteToCharIndex[byteStart] ?? 0;
	const end = byteToCharIndex[byteEnd] ?? text.length;

	return [start, end];
}

const applyFacetsToText = (text, facets = []) => {
	if (!facets || facets.length === 0) return text;

	const inserts = [];

	for (const facet of facets) {
		if (!facet.index || !facet.features) continue;

		const { byteStart, byteEnd } = facet.index;
		const [start, end] = byteRangeToCharRange(text, byteStart, byteEnd);
		const spanText = text.slice(start, end);

		// Trim visible text for markdown cleanliness
		let trimmedText = spanText.trim();

		// Trim trailing punctuation (common for links/mentions)
		trimmedText = trimmedText.replace(/[.,…:;!?]+$/, '');

		// Compute new start/end positions
		const leadingTrim = spanText.indexOf(trimmedText);
		const trailingTrim = spanText.length - leadingTrim - trimmedText.length;

		const newStart = start + leadingTrim;
		const newEnd = end - trailingTrim;

		// Apply the first feature (Bluesky usually only uses one)
		const feature = facet.features[0];
		if (!feature) continue;

		let replacement;
		switch (feature.$type) {
			case "app.bsky.richtext.facet#link":
				replacement = `[${trimmedText}](${feature.uri})`;
				break;

			case "app.bsky.richtext.facet#mention":
				replacement = `[${trimmedText}](https://bsky.app/profile/${feature.did})`;
				break;

			case "app.bsky.richtext.facet#tag": {
				const tag = trimmedText.replace(/^#/, "");
				replacement = `[#${tag}](/tags/${tag})`; // adjust if you use different tag URLs
				break;
			}

			default:
				continue;
		}

		inserts.push({ start: newStart, end: newEnd, replacement });
	}

	// Sort in reverse so indexes don't shift during replacement
	inserts.sort((a, b) => b.start - a.start);
	for (const { start, end, replacement } of inserts) {
		text = text.slice(0, start) + replacement + text.slice(end);
	}

	return text;
}

export default async function () {
	try {
		const data = await Cache(
			`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${process.env.BLUESKY_USERNAME}&filter=posts_and_author_threads`,
			{ duration: "1d", type: "json" }
		);

		return data.feed.map(item => {
			const record = item.post?.record || {};
			const rawText = record.text || '';
			const markdown = applyFacetsToText(rawText, record.facets || []);

			return {
				...item,
				rawText,
				markdown
			};
		});
	} catch (e) {
		console.error("Bluesky fetch error:", e);
		return [];
	}
}