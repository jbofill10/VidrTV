import {default as mongoose, default as db} from "./mongoose";

var Schema = mongoose.Schema;

var ytSchema = new Schema({
    title : String,
    songs : [String]
});
