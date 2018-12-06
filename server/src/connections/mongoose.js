import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

var database = null;
mongoose.connect(
	process.env.MONGO_URL,
	{ useNewUrlParser: true },
	(err, db) => {
		if (err) console.log(err);
		else console.log("Successfully connected to MongoDB Atlas!");
		database = db;
	}
);
export default { mongoose, database };
