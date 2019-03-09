import chalk from "chalk";
import { getMediaInfo } from "./Media";
import { RoomModel } from "./Models";

export default class Room {
	constructor(io, clock, doc) {
		this.io = io;
		this.clock = clock;
		this.id = doc._id;

		/** room db model */
		this.model = RoomModel(doc);
		this.log("loaded room");

		this.open = true;
		this.log("room is open for connections");

		if (this.model.media.length > 0) this.queuePlayback(0);
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

	queuePlayback(index, delay = 10000) {
		this.model.cur = index;
		this.model.start = Date.now() + delay;

		getMediaInfo("youtube", this.model.media[this.model.cur])
			.then(result => {
				// console.log(result.raw);

				this.io.to(this.id).emit("fullsync", {
					name: this.model.name,
					media: this.model.media,
					cur: this.model.cur,
					duration: result.duration,
					start: this.model.start
				});

				setTimeout(() => {
					// start next video
					this.queuePlayback((index + 1) % this.model.media.length);
				}, result.duration + delay);
			})
			.catch(error => {
				console.error(error);

				setTimeout(() => {
					// start next video
					this.queuePlayback((index + 1) % this.model.media.length);
				}, delay);
			});
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
