import mongoose from "mongoose";
import chalk from "chalk";
import { status } from "./log";

export default class db {
	static init() {
		console.log("[DB] Connecting to MongoDB Atlas...");

		// connect to mongoose server
		mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useFindAndModify: false
		});

		const db = mongoose.connection;

		db.on("error", () => {
			console.error("[DB] Failed to connect to database");
			console.error("[DB] You might need to whitelist your IP!");
		});

		db.once("open", () => {
			console.log(
				chalk.green("[DB] Successfully connected to MongoDB Atlas!")
			);
			status.db = true;
		});

		return db;
	}
}
