import express from "express";
import socketio from "socket.io";
import { default as server } from "./express";

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

export default io;
