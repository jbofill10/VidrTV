import mongoose from "mongoose";
import dotenv from "dotenv";
import { loadSchema } from "./playlist_array";
dotenv.config();

export function connectToMongoDB() {
	mongoose.connect(
		process.env.MONGO_URL,
		{ useNewUrlParser: true }
	);

	var db = mongoose.connection;
	db.on(
		"error",
		console.error.bind(
			console,
			"connection error:\nYou might need to whitelist your IP!"
		)
	);
	db.once("open", () => {
		console.log("Successfully connected to MongoDB Atlas!");

		loadSchema(db);
	});
}
