const express = require('express');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const port = process.env.PORT || 8000;


// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client", "build")));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const server = app.listen(port, () => {
	console.log("Listening on " + port);
});


const io = socketio(server);

io.on('connection', (socket) => {
	console.log("a user connected " + socket.id);
});
