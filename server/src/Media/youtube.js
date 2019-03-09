import fetch from "./fetch";
import { parse, toSeconds } from "iso8601-duration";

/**
 * parts to get for each resouce type
 */
const PARTS = {
	search: "snippet",
	videos: "snippet,contentDetails,statistics",
	playlist: "snippet",
	playlistitems: "snippet,status",
	channels: "snippet"
};

/**
 * Youtube data api v3 wrapper
 */
class YouTube {
	/**
	 * @param {string} key youtube data api v3 key
	 */
	constructor(key) {
		this._key = key;
	}

	/**
	 * make request to youtube api
	 * @param {string} endpoint api endpoint
	 * @param {*} query query params
	 * @returns {Promise<object>} fetch promise with response json
	 */
	request(endpoint, query = {}) {
		query.key = this._key;
		let params = Object.keys(query)
			.map(key => `${key}=${query[key]}`)
			.join("&");

		return fetch(
			encodeURI(
				`https://www.googleapis.com/youtube/v3/${endpoint}${
					params.length ? "?" : ""
				}${params}`
			)
		)
			.then(result => result.json())
			.then(result => {
				if (result.error) return Promise.reject(result.error);
				return result;
			});
	}

	/**
	 * gets a resource from the youtube api
	 * @param {string} type resource type
	 * @param {*} id resource id
	 * @param {*} query query parameters
	 */
	getResource(type, id, query = {}) {
		query = Object.assign(
			{ part: PARTS[type] },
			Object.assign(query, { id })
		);
		return this.request(type, query).then(res =>
			res.items.length === 0
				? Promise.reject(new Error(`resource ${res.kind} not found`))
				: res.items[0]
		);
	}

	/**
	 * fetches and translates video info into media info
	 * @param {string} id youtube video id
	 */
	getInfo(id) {
		return this.getResource("videos", id, {})
			.then(result =>
				Promise.all([
					result,
					this.getResource("channels", result.snippet.channelId, {})
				])
			)
			.then(result => {
				// result[0] video info
				// result[1] channel info

				return {
					raw: result,
					url: `https://www.youtube.com/watch?v=${id}`,
					title: result[0].snippet.title,
					description: result[0].snippet.description,
					publishedAt: result[0].snippet.publishedAt,
					authorTitle: result[0].snippet.channelTitle,
					authorThumb: result[1].snippet.thumbnails.default.url,
					authorUrl: `https://www.youtube.com/channel/${
						result[1].id
					}`,
					smallThumb: result[0].snippet.thumbnails.default.url,
					mediumThumb: result[0].snippet.thumbnails.medium.url,
					largeThumb: result[0].snippet.thumbnails.maxres.url,
					duration:
						toSeconds(parse(result[0].contentDetails.duration)) *
						1000
				};
			});
	}
}

/**
 * instance of the youtube data api wrapper
 **/
const youtube = new YouTube(process.env.REACT_APP_GOOGLE_API_KEY);
export { youtube };
