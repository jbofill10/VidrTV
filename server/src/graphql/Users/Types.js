import { GraphQLObjectType, GraphQLString } from "graphql";

/**
 * Graphql User Type
 */

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLString },
		lastLogin: { type: GraphQLString }
	})
});

export { UserType };
