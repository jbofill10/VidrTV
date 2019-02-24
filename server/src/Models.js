import mongoose from "mongoose";
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInt,
	GraphQLNonNull
} from "graphql";

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
	time: Number
});

//graphQl Schema
const RoomType = new GraphQLObjectType({
	name: "Room",
	fields: () => ({
		media: { type: GraphQLList(GraphQLString) },
		name: { type: GraphQLString },
		cur: { type: GraphQLInt },
		time: { type: GraphQLInt }
	})
});

export { RoomModel, UserInfoModel, RoomType };
