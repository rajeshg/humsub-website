// This will fetch videos on the server and send them to the client without exposing the API key.
import type { APIRoute } from "astro";

export const prerender = false;
const API_KEY = import.meta.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UCAAnYBbBb9gJ2cNOeG7lfNQ";
const MAX_RESULTS = 50;

interface YouTubeSearchResponse {
	items: {
		id: {
			videoId: string;
		};
	}[];
	nextPageToken?: string;
}

export const GET: APIRoute = async ({ locals }) => {
	const kv = locals.runtime.env.KV;

	// Check if the videos are already cached
	const cachedVideos = await kv.get("youtube-videos");
	if (cachedVideos) {
		return new Response(
			JSON.stringify({
				videos: JSON.parse(cachedVideos),
			}),
		);
	}
	// If not cached, fetch the videos from YouTube API
	console.log("Cache MISS. Fetching videos from YouTube API");
	let videos: string[] = [];
	let nextPageToken = "";

	try {
		do {
			const response = await fetch(
				`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${MAX_RESULTS}&order=date&type=video&channelId=${CHANNEL_ID}&key=${API_KEY}&pageToken=${nextPageToken}`,
			);
			const data: YouTubeSearchResponse = await response.json();
			videos = [
				...videos,
				...data.items.map(
					(item) => `https://www.youtube.com/embed/${item.id.videoId}`,
				),
			];
			nextPageToken = data.nextPageToken || "";
		} while (nextPageToken);
	} catch (error) {
		return new Response(JSON.stringify({ error: "Failed to fetch videos" }), {
			status: 500,
		});
	}
	// put the videos in the cache
	try {
		await kv.put("youtube-videos", JSON.stringify(videos), {
			expirationTtl: 60 * 60 * 24, // Cache for 1 day
		});
	} catch (error) {
		console.error("Error caching videos:", error);
	}

	return new Response(
		JSON.stringify({
			videos,
		}),
	);
};
