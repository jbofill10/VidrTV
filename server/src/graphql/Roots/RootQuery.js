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
				var rooms = Object.keys(RoomService.currentRooms);
				console.log(rooms.splice((args.id - 1) * 10, args.id * 10 + 1));
				return rooms.splice((args.id - 1) * 10, args.id * 10 + 1);
			}
		}
	}
});

export { RootQuery };
