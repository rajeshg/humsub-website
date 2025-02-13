// This will fetch videos on the server and send them to the client without exposing the API key.
import type { APIRoute } from "astro";

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

export const GET: APIRoute = async () => {
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

	return new Response(JSON.stringify({ videos: videos.reverse() }), {
		status: 200,
	});
};
