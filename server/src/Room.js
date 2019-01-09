import mongoose from "mongoose";
import chalk from "chalk";
import { youtube } from "./youtube";

const RoomModel = mongoose.model("room", {
	name: String,
	media: [String],
	cur: Number,
	time: Number
});
export { RoomModel };

const mediaInfoCache = {};

export default class Room {
	constructor(io, doc) {
		/** room channel */
		this.io = io.in(doc._id);
		this.broadcast = io.sockets.in(doc._id);

		/** room db model */
		this.model = RoomModel(doc);
		this.log("loaded room");

		// get info for the current video
		// TODO: move media info caching stuff to youtube.js
		if (this.model.media[this.model.cur] in mediaInfoCache) {
			this.open = true;

			this.log("room is open for connections");

			this.startPlayback(0);
		} else
			youtube
				.getVideoByID(this.model.media[this.model.cur])
				.then(result => {
					mediaInfoCache[this.model.media[this.model.cur]] = result;
					this.open = true;

					this.log("room is open for connections");

					this.startPlayback(0);
				})
				.catch(console.error);

		// get info for the other videos async
		for (let i = 0; i < this.model.media.length; i++) {
			if (i === this.model.cur || this.model.media[i] in mediaInfoCache)
				continue;
			youtube
				.getVideoByID(this.model.media[i])
				.then(result => (mediaInfoCache[this.model.media[i]] = result))
				.catch(console.error);
		}
	}

	join(socket) {
		socket.join(this.model._id);

		this.log(socket.id + " joined room");

		this.updateTime();
		socket.emit("fullsync", {
			name: this.model.name,
			media: this.model.media,
			cur: this.model.cur,
			time: this.model.time
		});

		socket.on("disconnect", () => {
			this.log(socket.id + " disconnected");
		});
	}

	save() {
		this.model.save();
		this.log("saved room to db");
	}

	_lastUpdate = Date.now();

	updateTime() {
		let now = Date.now();
		let delta = now - this._lastUpdate;
		this._lastUpdate = now;

		this.model.time += delta;
	}

	startPlayback(index) {
		this.model.cur = index;
		this.model.time = 0;
		this._lastUpdate = Date.now();

		let duration =
			mediaInfoCache[this.model.media[this.model.cur]].durationSeconds *
			1000;

		this.broadcast.emit("fullsync", {
			name: this.model.name,
			media: this.model.media,
			cur: this.model.cur,
			time: this.model.time
		});

		// sync time every 3 seconds
		let syncloop = setInterval(() => {
			this.updateTime();
			this.broadcast.emit("timesync", this.model.time);

			// stop loop at the end of the video
			if (this.model.time + 3000 >= duration) {
				clearInterval(syncloop);
			}
		}, 3000);

		setTimeout(() => {
			// make sure syncloop is dead
			clearInterval(syncloop);

			// start next video
			this.startPlayback((index + 1) % this.model.media.length);
		}, duration + 3000);
	}

	log(message) {
		console.log(`${chalk.cyan(`[Room<${this.model._id}>]`)} ${message}`);
	}
}
