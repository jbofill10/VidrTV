import express from "express";
import sockets from "./sockets";
import db from "./db";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

// Setup database

db.init();

// Setup Express server

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
	console.log("Listening on " + port);
});

// Setup socketio

sockets.init(server);
