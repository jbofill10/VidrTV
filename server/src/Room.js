import chalk from "chalk";
import { youtube } from "./youtube";
import { RoomModel } from "./Models";

const mediaInfoCache = {};
export { RoomModel };
export default class Room {
	constructor(io, clock, doc) {
		this.io = io;
		this.clock = clock;
		this.id = doc._id;

		/** room db model */
		this.model = RoomModel(doc);
		this.log("loaded room");

		// get info for the current video
		// TODO: move media info caching stuff to youtube.js
		if (this.model.media.length == 0) {
			this.log("room is open for connections");
		} else if (this.model.media[this.model.cur] in mediaInfoCache) {
			this.open = true;

			this.log("room is open for connections");

			this.queuePlayback(0);
		} else {
			youtube
				.getVideoByID(this.model.media[this.model.cur])
				.then(result => {
					mediaInfoCache[this.model.media[this.model.cur]] = result;
					this.open = true;

					this.log("room is open for connections");

					this.queuePlayback(0);
				})
				.catch(console.error);

			// get info for the other videos async
			for (let i = 0; i < this.model.media.length; i++) {
				if (
					i === this.model.cur ||
					this.model.media[i] in mediaInfoCache
				)
					continue;
				youtube
					.getVideoByID(this.model.media[i])
					.then(
						result => (mediaInfoCache[this.model.media[i]] = result)
					)
					.catch(console.error);
			}
		}
	}

	join(socket) {
		socket.join(this.model._id);

		this.log(socket.id + " joined room");

		// this.updateTime();
		socket.emit("fullsync", {
			name: this.model.name,
			media: this.model.media,
			cur: this.model.cur,
			start: this.model.start
		});

		socket.on("clocksync", data => {
			// immediately respond
			socket.emit("clocksync", this.clock.processRequest(data));
			// do a time update and sync
			// this.updateTime();
			// this.io.to(this.id).emit("timesync", this.model.start);
		});

		socket.on("disconnect", () => {
			this.log(socket.id + " disconnected");
		});
	}

	save() {
		this.model.save();
		this.log("saved room to db");
	}

	// _lastUpdate = Date.now();

	// updateTime() {
	// 	let now = Date.now();
	// 	let delta = now - this._lastUpdate;
	// 	this._lastUpdate = now;

	// 	this.model.time += delta;
	// }

	queuePlayback(index, delay = 10000) {
		this.model.cur = index;
		this.model.start = Date.now() + delay;
		// this._lastUpdate = Date.now();

		let duration =
			mediaInfoCache[this.model.media[this.model.cur]].durationSeconds *
			1000;

		this.io.to(this.id).emit("fullsync", {
			name: this.model.name,
			media: this.model.media,
			cur: this.model.cur,
			duration: duration,
			start: this.model.start
		});

		// sync time every 3 seconds
		// let syncloop = setInterval(() => {
		// 	this.updateTime();
		// 	this.io.to(this.id).emit("timesync", this.model.time);

		// 	// stop loop at the end of the video
		// 	if (this.model.time + 3000 >= duration) {
		// 		clearInterval(syncloop);
		// 	}
		// }, 3000);

		setTimeout(() => {
			// make sure syncloop is dead
			// clearInterval(syncloop);

			// start next video
			this.queuePlayback((index + 1) % this.model.media.length);
		}, duration + delay);
	}

	log(message) {
		console.log(`${chalk.cyan(`[Room<${this.model._id}>]`)} ${message}`);
	}

	getInfo() {
		const infoObj = {
			media: this.model.media,
			name: this.model.name,
			cur: this.model.cur,
			start: this.model.start,
			open: this.open
		};
		return infoObj;
	}
}
