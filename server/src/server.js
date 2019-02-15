import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import socketio from "socket.io";
import path from "path";
import chalk from "chalk";
import { status } from "./log";
import db from "./db";
import RoomService from "./RoomService";
import { register } from "./Routes.js";

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

// body parser to read POSTs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = app.listen(port, () => {
	console.log(chalk.green("[Express] Listening on " + port));
	status.express = true;
});

// start room service
RoomService.start(app, socketio(server));

// register routes
register(app, clientpath);
