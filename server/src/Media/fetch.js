import NodeFetch from "node-fetch";

// // cached fetch responses
// const _cache = {};
// queued fetch promisses that haven't been resolved
const _queue = {};
// // max age for cached response before fetching again
// const MaxAge = 60000; // 3 minutes

/**
 * fetch with queuing
 * inspired by https://github.com/janneh/fetch-cached/blob/master/index.js
 */
export default function fetch(url, options = {}) {
	// use normal fetch for not get requests
	if (options.method && options.method !== "GET")
		return NodeFetch(url, options);

	// url is in cache and not old
	// if (
	// 	_cache.hasOwnProperty(url) &&
	// 	_cache[url].data &&
	// 	_cache[url].time + MaxAge >= Date.now()
	// )
	// 	return Promise.resolve({
	// 		ok: true,
	// 		url: url,
	// 		status: 200,
	// 		statusText: "OK",
	// 		json: () => Promise.resolve(JSON.parse(_cache[url].data)),
	// 		text: () => Promise.resolve(_cache[url].data)
	// 	});

	// only fetch if there isn't a fetch already queued for the url
	if (!_queue.hasOwnProperty(url))
		_queue[url] = NodeFetch(url, options).then(res => {
			// remove from queue
			delete _queue[url];

			// save to cache
			// res.clone()
			// 	.text()
			// 	.then(
			// 		value => (_cache[url] = { data: value, time: Date.now() })
			// 	);

			// resolve
			return Promise.resolve(res);
		});

	// return queued fetch
	return _queue[url];
}
