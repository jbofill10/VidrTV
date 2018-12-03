import express from "express";
import path from "path";
import socketio from "socket.io";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 8080;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client", "build")));

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const server = app.listen(port, () => {
	console.log("Listening on " + port);
});

const room = {
	queue: [
		"TjAa0wOe5k4", // Twitch A/V sync
		"Sz_YPczxzZc", // official youtube music
		"mM5_T-F1Yn4", // 4:3 video test
		"En6TUJJWwww", // vertical video test
		"5T_CqqjOPDc" // free youtube movie
	],
	cur: 0,
	time: 0
};

var lastUpdate = Date.now();

function updateRoom() {
	let now = Date.now();
	let delta = now - lastUpdate;
	lastUpdate = now;

	room.time += delta;
	room.time %= 120000;
}

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
