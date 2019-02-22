import mongoose from "mongoose";
import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInt
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
const RoomSchema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "Room",
		fields: {
			name: { type: GraphQLString },
			media: { type: GraphQLList(GraphQLString) },
			cur: { type: GraphQLInt },
			time: { type: GraphQLInt }
		}
	})
});

export { RoomModel, UserInfoModel, RoomSchema };
