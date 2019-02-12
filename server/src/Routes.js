import fs from "fs";
import path from "path";
import { check, validationResult } from "express-validator/check";
import { OAuth2Client } from "google-auth-library";
import { UserInfoModel, RoomModel } from "./Models";

// google auth client
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_API_KEY);

/**
 * Register api routes
 * @param {Express.Application} app
 */
export function register(app, clientpath) {
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

	app.post("/api/room/create", (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(442).json({ errors: errors.array() });
		else console.log(req.body.submission);
		res.json(errors);
	});

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

	// load index html file as a string
	const indexhtml = fs
		.readFileSync(path.join(clientpath, "index.html"), {
			enchoding: "utf-8"
		})
		.toString();

	// position to inject custom tags into the head
	const insertpos = indexhtml.match(/<head>/).index + 6;

	// handle room invite link meta tags
	app.get("/r/*", (req, res) => {
		// send index.html to client with modified meta
		res.set("Content-Type", "text/html");
		res.send(
			`${indexhtml.slice(
				0,
				insertpos
			)}<link rel="alternate" type="application/json+oembed" href="/oembed.json?r=${encodeURIComponent(
				req.path.slice(3)
			)}"><meta property="og:url" content="${req.protocol}://${req.get(
				"host"
			)}${req.originalUrl}">${indexhtml.slice(insertpos)}`
		);
	});

	app.get("/oembed.json", [], (req, res) => {
		res.json({
			title: "oembed test",
			description: "oembed test",
			version: "1.0",
			type: "rich",
			width: 480,
			height: 270,
			html: `<iframe width="480" height="270" src="${
				req.protocol
			}://${req.get("host")}/embed/${
				req.query.r
			}" frameborder="0"></iframe>`
		});
	});

	app.get("/embed/*", (req, res) => {
		res.set("Content-Type", "text/html");
		res.send(indexhtml);
	});

	// catch 404s
	// redirects to home
	// TODO: display 404 message (redirect to /404 ?)
	// app.get('/*', (req, res) => {
	// 	res.redirect('/');
	// });
}
