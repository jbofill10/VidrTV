import { GraphQLString, GraphQLObjectType } from "graphql";
import { RoomType } from "../Rooms/Types";
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
		}
	}
});

export { RootMutation };
