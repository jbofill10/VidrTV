import express from "express";
import socketio from "socket.io";
import path from "path";
import chalk from "chalk";
import { status } from "./log";
import db from "./db";
import RoomService from "./RoomService";
import dotenv from "dotenv";
dotenv.config();

// Setup database

db.init();

// Setup Express server

console.log("[Express] Starting server");

const app = express();
const port = process.env.PORT || 8080;

// full path to this file as an array
let fullpath = path.dirname(__filename).split(path.sep);

// go to the project root
fullpath = fullpath.slice(0, fullpath.length - 2);

// path to client build dir
const clientpath = path.join(fullpath.join(path.sep), "client", "build");

// Serve the static files from the React app
app.use(express.static(clientpath));

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
	res.sendFile(path.join(clientpath, "index.html"));
});

const server = app.listen(port, () => {
	console.log(chalk.green("[Express] Listening on " + port));
	status.express = true;
});

// start room service
RoomService.start(socketio(server));
