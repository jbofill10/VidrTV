import socketio from "socket.io";
import mongoose from "mongoose";
import { youtube } from "./youtube";

export default class sockets {
	constructor(server) {
		this.io = socketio(server);

		this.room = {
			name: "",
			media: [],
			cur: 0,
			time: 0
		};

		this.mediacache = {};
	}

	saveRoom() {
		// let testroom = new mongoose.model('room')({
		// 	name: 'test room sldkjflskd',
		// 	media: [
		// 		'TjAa0wOe5k4', // Twitch A/V sync
		// 		'Sz_YPczxzZc', // official youtube music
		// 		'mM5_T-F1Yn4' // 4:3 video test
		// 	]
		// });
		// testroom.save();
	}

	loadRoom(roomid) {
		console.log(`loading room ${roomid}`);

		// fetch room data from db
		mongoose.model("room").findById(roomid, (err, res) => {
			if (err) console.error(`unable to find room ${roomid}`);
			else {
				this.room.media = res.media;
				this.room.name = res.name;
				this.room.cur = 0;
				this.room.time = 0;

				// get info for the current video
				youtube
					.getVideoByID(this.room.media[this.room.cur])
					.then(result => {
						this.mediacache[
							this.room.media[this.room.cur]
						] = result;

						// we have enough data to open the room to connections
						this.openRoom();
					})
					.catch(console.error);

				// get info for the other videos async
				for (let i = 0; i < this.room.media.length; i++) {
					if (i === this.room.cur) continue;
					youtube
						.getVideoByID(this.room.media[i])
						.then(
							result =>
								(this.mediacache[this.room.media[i]] = result)
						)
						.catch(console.error);
				}
			}
		});
	}

	openRoom() {
		this.io.on("connection", socket => {
			console.log(socket.id + " connected");

			this.updateTime();
			socket.emit("fullsync", this.room);

			socket.on("disconnect", () => {
				console.log(socket.id + " disconnected");
			});
		});

		console.log("room is open for connections");

		this.startPlayback(0);
	}

	_lastUpdate = Date.now();

	updateTime() {
		let now = Date.now();
		let delta = now - this._lastUpdate;
		this._lastUpdate = now;

		this.room.time += delta;
	}

	startPlayback(index) {
		this.room.cur = index;
		this.room.time = 0;
		this._lastUpdate = Date.now();

		let duration =
			this.mediacache[this.room.media[this.room.cur]].durationSeconds *
			1000;

		this.io.sockets.emit("fullsync", this.room);

		// sync time every 3 seconds
		let syncloop = setInterval(() => {
			this.updateTime();
			this.io.sockets.emit("timesync", this.room.time);

			// stop loop at the end of the video
			if (this.room.time + 3000 >= duration) {
				clearInterval(syncloop);
			}
		}, 3000);

		setTimeout(() => {
			// make sure syncloop is dead
			clearInterval(syncloop);

			// start next video
			this.startPlayback((index + 1) % this.room.media.length);
		}, duration + 3000);
	}
}
