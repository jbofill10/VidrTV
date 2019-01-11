import { RoomModel } from "./Room";
import { check, validationResult } from "express-validator/check";

/**
 * Register api routes
 * @param {Express.Application} app
 */
export function register(app) {
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
