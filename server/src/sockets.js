import socketio from "socket.io";
import mongoose from "mongoose";

export default class sockets {
	static init(server) {
		const room = {};

		// let testroom = new mongoose.model('room')({
		// 	name: 'test room sldkjflskd',
		// 	media: [
		// 		'TjAa0wOe5k4', // Twitch A/V sync
		// 		'Sz_YPczxzZc', // official youtube music
		// 		'mM5_T-F1Yn4' // 4:3 video test
		// 	]
		// });

		// testroom.save();

		mongoose
			.model("room")
			.findById("5c1c129c8134305cf00f2cfd", (err, res) => {
				if (err) console.error("unable to find room");
				else {
					room.media = res.media;
					room.name = res.name;
					room.cur = 0;
					room.time = 0;
				}
			});

		const io = socketio(server);

		io.on("connection", socket => {
			console.log("a user connected " + socket.id);

			updateRoom();
			socket.emit("statesync", room);

			socket.on("disconnect", () => {
				console.log("user disconnected");
			});

			socket.on("seekTo", newtime => {
				room.time = newtime * 1000;
				lastUpdate = Date.now();
				socket.broadcast.emit("seekTo", newtime);
			});
		});

		var lastUpdate = Date.now();

		function updateRoom() {
			let now = Date.now();
			let delta = now - lastUpdate;
			lastUpdate = now;

			room.time += delta;
			room.time %= 120000;
		}

		// sync room state every 3 seconds
		let loop = setInterval(() => {
			updateRoom();
			io.sockets.emit("statesync", room);
		}, 3000);

		return io;
	}
}
