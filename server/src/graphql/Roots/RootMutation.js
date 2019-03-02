import { GraphQLString, GraphQLObjectType, GraphQLList } from "graphql";
import { RoomType, SongType } from "../Rooms/Types";
import { UserType } from "../Users/Types";
import { RoomModel, UserInfoModel } from "../index";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_API_KEY);

let RootMutation = new GraphQLObjectType({
	name: "RootMutation",
	fields: {
		addRoom: {
			type: RoomType,
			args: {
				id: { type: GraphQLString },
				media: { type: GraphQLString }
			},
			resolve: (root, args) => {
				RoomModel.findOneAndUpdate(
					{ _id: args.id },
					{ $push: { media: args.media }, new: true, upsert: true },
					(err, res) => {
						if (err) return console.log(err);
						else return JSON.stringify(res);
					}
				);
			}
		},
		addUser: {
			type: UserType,
			args: {
				id: { type: GraphQLString }
			},
			resolve: (root, args) => {
				client
					.verifyIdToken({
						idToken: args.id,
						clientID: process.env.REACT_APP_OAUTH_CLIENT_ID
					})
					.then(ticket => {
						const payload = ticket.getPayload();
						const userid = payload["sub"];
						//Insert token if new, if not update
						UserInfoModel.updateOne(
							{ _id: userid },
							{ _id: userid, lastlogin: Date.now() },
							{ upsert: true }
						);
						return userid.json({ loggedin: true });
					});
			}
		},
		addSong: {
			type: new GraphQLList(SongType),
			args: {
				roomid: { type: GraphQLString },
				link: { type: GraphQLString }
			},
			resolve: (root, args) => {
				var songID = args.link.substring(
					args.link.indexOf("=") + 1,
					args.link.length + 1
				);

				RoomModel.findOneAndUpdate(
					{ _id: args.roomid },
					{ $push: { media: songID }, new: true, upsert: true },
					err => {
						if (err)
							return console.log("Error in adding song to DB");
						else return { roomid: args.roomid, link: args.link };
					}
				);
			}
		}
	}
});

export { RootMutation };
