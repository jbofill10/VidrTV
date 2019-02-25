import { GraphQLSchema, GraphQLObjectType } from "graphql";
//Room Imports
import { RoomModel, UserInfoModel } from "../Models";
import { RootQuery } from "./Roots/RootQuery";
import { RootMutation } from "./Roots/RootMutation";

//Load all of the graphql queries, mutations, etc, here

const GraphQLFunctions = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation
});

export { RoomModel, GraphQLFunctions, UserInfoModel };
