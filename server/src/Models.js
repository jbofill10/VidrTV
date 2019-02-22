import mongoose from "mongoose";
import {
	GraphQLSchema,
	graphql,
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
			media: { type: GraphQLList(GraphQLString) },
			name: {
				type: GraphQLString,
				resolve() {
					RoomModel.find({}, { name: String }, (err, docs) => {
						if (err) console.log(err);
						else console.log(docs);
					});
				}
			},
			__v: GraphQLInt,
			cur: GraphQLInt,
			time: GraphQLInt
		}
	})
});

export { RoomModel, UserInfoModel, RoomSchema };
