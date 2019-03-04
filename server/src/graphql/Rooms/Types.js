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
		start: { type: GraphQLInt },
		open: { type: GraphQLString },
		ids: { type: GraphQLList(GraphQLString) }
	})
});

const SongType = new GraphQLObjectType({
	name: "Song",
	fields: () => ({
		roomid: { type: GraphQLString },
		link: { type: GraphQLString }
	})
});

export { RoomType, SongType };
