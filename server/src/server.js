import express from "express";
import bodyParser from "body-parser";
import socketio from "socket.io";
import path from "path";
import chalk from "chalk";
import { status } from "./log";
import db from "./db";
import RoomService from "./RoomService";
import { register } from "./Routes.js";
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

// body parser to read POSTs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// get router instance
const router = express.Router();

router.use((req, res, next) => {
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get("/", (req, res) => {
	res.json({ message: "hooray! welcome to our api!" });
});

register(app);

// all of our routes will be prefixed with /api
app.use("/api", router);

// handles all non api requests
app.get("*", (req, res) => {
	// send index.html to client
	res.sendFile(path.join(clientpath, "index.html"));
});

const server = app.listen(port, () => {
	console.log(chalk.green("[Express] Listening on " + port));
	status.express = true;
});

// start room service
RoomService.start(socketio(server));
