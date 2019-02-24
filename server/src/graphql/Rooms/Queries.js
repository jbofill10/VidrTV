import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLSchema,
	GraphQLString,
	GraphQLList
} from "graphql";
import { RoomType, RoomModel } from "../index";

const RoomQuery = new GraphQLObjectType({
	name: "RoomQuery",
	fields: {
		room: {
			type: new GraphQLList(RoomType),
			resolve: () =>
				RoomModel.find({}, (err, res) => {
					if (err) console.log(err);
					else return JSON.stringify(res);
				})
		}
	}
});

const QueryRoomById = new GraphQLSchema({
	query: RoomQuery
});

export { QueryRoomById };
