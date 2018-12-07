import express from "express";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

export function runExpress() {
	const app = express();
	const port = process.env.PORT || 8080;

	// Serve the static files from the React app
	app.use(express.static(path.join(__dirname, "client", "build")));

	// Handles any requests that don't match the ones above
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client", "build", "index.html"));
	});

	const server = app.listen(port, () => {
		console.log("Listening on " + port);
	});
}
