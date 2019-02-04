import mongoose from "mongoose";

//UserID model for DB
const Schema = mongoose.Schema;
const userIdSchema = new Schema(
	{
		userID: String
	},
	{ collection: "userInfo" }
);
const userIdInfo = mongoose.model("userIdInfo", userIdSchema);

//Playlist model for DB
const RoomModel = mongoose.model("room", {
	name: String,
	media: [String],
	cur: Number,
	time: Number
});

export { RoomModel, userIdInfo };
