import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(
	process.env.MONGO_URL,
	{ useNewUrlParser: true }
);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Successfully connected to MongoDB Atlas!");
});
export default { mongoose, db };
