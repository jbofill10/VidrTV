import mongoose from "mongoose";
import "./models/room";
import dotenv from "dotenv";
dotenv.config();

export default class db {
	static init() {
		mongoose.connect(
			process.env.MONGO_URL,
			{ useNewUrlParser: true }
		);

		const db = mongoose.connection;

		db.on(
			"error",
			console.error.bind(
				console,
				"connection error:\nYou might need to whitelist your IP!"
			)
		);

		db.once("open", () => {
			console.log("Successfully connected to MongoDB Atlas!");
		});

		return db;
	}
}
