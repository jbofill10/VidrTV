import { RoomModel } from "./Room";
import { check, validationResult } from "express-validator/check";
import { OAuth2Client } from "google-auth-library";
import { UserInfoModel } from "./Models";
import dotenv from "dotenv";
dotenv.config();

// google auth client
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_API_KEY);

/**
 * Register api routes
 * @param {Express.Application} app
 */
export function register(app) {
	// google login using id_token
	app.post(
		"/auth/google/tokensignin",
		[check("idtoken").exists()],
		(req, res) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(442).json({ errors: errors.array() });
			}
			client
				.verifyIdToken({
					idToken: req.body.idtoken,
					clientID: process.env.REACT_APP_OAUTH_CLIENT_ID
				})
				.then(ticket => {
					const payload = ticket.getPayload();
					const userid = payload["sub"];
					//Insert token if new, if not update
					UserInfoModel.updateOne(
						{ _id: userid },
						{ _id: userid, lastlogin: Date.now() },
						{ upsert: true },
						err => {
							if (err) {
								return res
									.status(500)
									.json({ errors: errors.array() });
							} else {
								console.log(
									`[OAuth2] User #${userid} login successful!`
								);
								// TODO: send stored user info back to the client
								return res.json({ loggedin: true });
							}
						}
					);
				})
				.catch(err => {
					return res.status(442).json({ errors: err.toString() });
				});
		}
	);

	// room list and search
	// TODO: query params for search and pagination
	app.get("/api/rooms", [], (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(442).json({ errors: errors.array() });

		// fetch all room docs from mongo
		RoomModel.find({}, (err, docs) => {
			if (err) res.status(500).send(err);
			// all good, send it
			else res.json(docs);
		});
	});

	// get room info by id
	// TODO: optional params to only send specified info
	app.get("/api/room/:id", [check("id").isMongoId()], (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(442).json({ errors: errors.array() });

		// fetch room doc from mongo
		RoomModel.findById(req.params.id, (err, docs) => {
			if (err) res.status(500).send(err);
			// all good, send it
			else res.json(docs);
		});
	});
}
