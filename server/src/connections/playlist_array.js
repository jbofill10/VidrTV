import mongoose from "mongoose";
export function loadSchema(db) {
	var Schema = mongoose.Schema;

	var ytSchema = new Schema({
		title: String,
		songs: [String]
	});

	var smallQ = [
		"TjAa0wOe5k4",
		"Sz_YPczxzZc",
		"mM5_T-F1Yn4",
		"En6TUJJWwww",
		"5T_CqqjOPDc"
	];

	var queue = mongoose.model("ytSchema", ytSchema);

	/* queue.create({},((err, ytSchema) =>{
        if(err) return err;
        console.log("Song Queue Created");
    }))*/
	queue.findOne({ _id: "5c0a50997923d966945fd642" }, function(
		err,
		FoundObject
	) {
		if (err) return err;
		else {
			if (!FoundObject) {
				console.log("Not found");
			} else {
				console.log("\nFetching data...");
				console.log(FoundObject.songs);
			}
		}
	});
}
