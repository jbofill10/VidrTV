import chalk from "chalk";
import { status } from "./log";
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
	start(io) {
		this.io = io;

		// get room data from db

		log("Starting...");
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
