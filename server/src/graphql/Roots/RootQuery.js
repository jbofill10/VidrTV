import {
	GraphQLObjectType,
	GraphQLList,
	GraphQLInt,
	GraphQLString
} from "graphql";
import { RoomType } from "../Rooms/Types";
import { UserType } from "../Users/Types";
import { RoomModel, UserInfoModel, RoomService } from "../index";

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
		}
	},
	users: {
		type: new GraphQLList(UserType),
		resolve: () => {
			return UserInfoModel.find({});
		}
	},
	certainRooms: {
		type: new GraphQLList(RoomType),
		args: {
			page: { type: GraphQLInt }
		},
		resolve: (root, args) => {
			var skip = (args.page - 1) * 10;
			return RoomModel.find({})
				.skip(skip)
				.limit(10);
		}
	}
});

export { RootQuery };
