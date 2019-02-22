import { GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql";
import { RoomSchema, RoomModel } from "../index";

const RoomQuery = new GraphQLObjectType({
	name: "RoomQuery",
	fields: {
		room: {
			type: RoomSchema,
			args: { id: { type: { GraphQLString } } },
			resolve(args) {
				return RoomModel.findById(args.id);
			}
		}
	}
});

const finalProduct = new GraphQLSchema({
	query: RoomQuery
});

export { finalProduct };
