import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInt
} from "graphql";

/**
 * Graphql Room Type
 */
const RoomType = new GraphQLObjectType({
	name: "Room",
	fields: () => ({
		media: { type: GraphQLList(GraphQLString) },
		name: { type: GraphQLString },
		cur: { type: GraphQLInt },
		time: { type: GraphQLInt },
		open: { type: GraphQLString }
	})
});

export { RoomType };
