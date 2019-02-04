import mongoose from "mongoose";

//UserID model for DB
const userID = mongoose.model("userInfo", {
	userID: String
});

//Playlist model for DB
const RoomModel = mongoose.model("room", {
	name: String,
	media: [String],
	cur: Number,
	time: Number
});

export { RoomModel, userID };
