import {
	GraphQLObjectType,
	GraphQLList,
	GraphQLInt,
	GraphQLString
} from "graphql";
import { RoomType } from "../Rooms/Types";
import { UserType } from "../Users/Types";
import { UserInfoModel, RoomService } from "../index";

let RootQuery = new GraphQLObjectType({
	name: "RootQuery",
	fields: {
		rooms: {
			type: RoomType,
			args: {
				id: { type: GraphQLString }
			},
			resolve: (root, args) => {
				return RoomService.currentRooms[args.id].getInfo();
			}
		},

		users: {
			type: new GraphQLList(UserType),
			resolve: () => {
				return UserInfoModel.find({});
			}
		},
		getPageOfRooms: {
			type: new GraphQLList(RoomType),
			args: {
				page: { type: GraphQLInt }
			},
			resolve: (root, args) => {
				return console.log(RoomService.currentRooms.getId());
			}
		}
	}
});

export { RootQuery };
