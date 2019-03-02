import { GraphQLSchema } from "graphql";
//Room Imports
import { RoomModel, UserInfoModel } from "../Models";
import { RootQuery } from "./Roots/RootQuery";
import { RootMutation } from "./Roots/RootMutation";

import RoomService from "../RoomService";

//Load all of the graphql queries, mutations, etc, here

const GraphQLFunctions = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation
});

export { RoomModel, GraphQLFunctions, UserInfoModel, RoomService };
