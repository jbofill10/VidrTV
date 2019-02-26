import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";

/**
 * Graphql User Type
 */

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLString },
		lastLogin: { type: GraphQLInt }
	})
});

export { UserType };
