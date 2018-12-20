import mongoose from "mongoose";

export default mongoose.model("room", {
	name: String,
	media: [String]
});
