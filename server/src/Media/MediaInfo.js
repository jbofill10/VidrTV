import { youtube } from "./youtube";

/**
 * universal stucture for media from different sources
 */
class MediaInfo {
	// required properties for all media info
	static required = [
		"raw",
		"url",
		"title",
		"description",
		"publishedAt",
		"authorTitle",
		"authorThumb",
		"authorUrl",
		"smallThumb",
		"mediumThumb",
		"largeThumb",
		"duration"
	];

	constructor(source, id, info) {
		this.source = source;
		this.id = id;

		MediaInfo.required.forEach(key => {
			if (!info.hasOwnProperty(key))
				throw new Error(
					`missing required info property "${key}" for ${source} ${id}`
				);
			Object.defineProperty(this, key, {
				value: info[key],
				writable: false
			});
		});
	}
}

// cached media info
const _cache = {};
// max age for cached medi info before fetching again
const MaxAge = 180000; // 3 minutes

const sources = {
	youtube: youtube
};

/**
 * gets media info
 * @param {string} source api source
 * @param {*} id unique id of media
 */
function getMediaInfo(source, id) {
	if (_cache.hasOwnProperty(source)) {
		if (
			_cache[source].hasOwnProperty(id) &&
			_cache[source][id].time + MaxAge >= Date.now()
		)
			return Promise.resolve(_cache[source][id].info);
	} else _cache[source] = {};

	return sources[source].getInfo(id).then(result => {
		_cache[source][id] = {
			info: new MediaInfo(source, id, result),
			time: Date.now()
		};
		return _cache[source][id].info;
	});
}

export { getMediaInfo };
