import mongoose from "mongoose";

// user info model
const UserInfoModel = mongoose.model("user", {
	_id: { type: Number, id: true },
	displayname: String,
	lastlogin: { type: Date, default: Date.now }
});

// room state model
const RoomModel = mongoose.model("room", {
	name: String,
	media: [String],
	cur: Number,
	time: Number,
	persistent: { type: Boolean, default: false }
});

export { RoomModel, UserInfoModel };
