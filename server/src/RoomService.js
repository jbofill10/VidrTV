import chalk from "chalk";
import { status } from "./log";
import { check, validationResult } from "express-validator/check";
import { default as Room, RoomModel } from "./Room";

/**
 * console.log prepended with [RoomService]
 * @param {String} message
 */
function log(message) {
	console.log(`${chalk.blue("[RoomService]")} ${message}`);
}

/**
 * Service that manages the current rooms being served
 */
class RoomService {
	/** Rooms currently being served  */
	currentRooms = {};

	/**
	 * Starts the Room Service
	 * @param {socketio.Server} io socket.io server
	 */
	start(app, io) {
		this.io = io;

		log("Starting...");

		// register api routes
		this.registerRoutes(app);

		// get room data from db

		log("Downloading room data from db...");

		RoomModel.find({}, (err, docs) => {
			if (err) {
				console.error("Error starting RoomService:");
				console.error("Failed to get room data from DB");
				console.error(err);
			} else {
				log(`Received data for ${docs.length} room(s)`);
				// load the rooms
				this.loadRooms(docs);
			}
		});
	}

	registerRoutes(app) {
		app.post("/api/room/create", (req, res) => {
			const errors = validationResult(req);
			if (!errors.isEmpty())
				return res.status(442).json({ errors: errors.array() });
			else console.log("Room created!");
			RoomModel.save(err => {
				if (err) {
					console.log("Error in adding room to DB");
					res.json(err);
				} else console.log("Room added to DB successfully");
			});
		});

		// room list and search
		// TODO: query params for search and pagination
		app.get("/api/rooms", [], (req, res) => {
			const errors = validationResult(req);
			if (!errors.isEmpty())
				return res.status(442).json({ errors: errors.array() });

			// fetch all room docs from mongo
			RoomModel.find({}, (err, docs) => {
				if (err) res.status(500).send(err);
				// all good, send it
				else res.json(docs);
			});
		});

		// get room info by id
		// TODO: optional params to only send specified info
		app.get("/api/room/:id", [check("id").isMongoId()], (req, res) => {
			const errors = validationResult(req);
			if (!errors.isEmpty())
				return res.status(442).json({ errors: errors.array() });

			// fetch room doc from mongo
			RoomModel.findById(req.params.id, (err, docs) => {
				if (err) res.status(500).send(err);
				// all good, send it
				else res.json(docs);
			});
		});
	}

	/**
	 * Load rooms from data
	 * @param {Array} docs room documents
	 */
	loadRooms(docs) {
		log(`Loading ${docs.length} room(s) from data...`);

		docs.forEach(doc => {
			this.currentRooms[doc._id] = new Room(this.io, doc);
			status.rooms++;
		});

		log(`Loaded ${docs.length} room(s)`);

		this.io.on("connection", socket => {
			log(`Client ${socket.id} connected`);
			status.connections++;

			socket.on("join", data => {
				this.joinRoom(socket, data.roomid);
			});

			socket.on("disconnect", () => {
				log(`Client ${socket.id} disconnected`);
				status.connections--;
			});
		});

		log(chalk.green("Service is now Online!"));
		status.roomservice = true;
	}

	joinRoom(socket, roomid) {
		if (!this.currentRooms.hasOwnProperty(roomid)) {
			// send '404 room not found' to client
			return;
		}

		if (!this.currentRooms[roomid].open) {
			// send 'room not loaded yet' to client
			return;
		}

		this.currentRooms[roomid].join(socket);
	}
}

/**
 * Service that manages the current rooms being served
 */
export default new RoomService();
