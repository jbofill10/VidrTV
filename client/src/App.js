import React from "react";
import { ProfileArea, PlaylistView, MediaPlayer } from "./components";
import "./App.css";

import openSocket from "socket.io-client";

class App extends React.Component {
	constructor() {
		super();

		this.state = {
			user: {},
			room: {},
			loading: true
		};
	}

	componentDidMount() {
		const socket = openSocket(
			process.env.NODE_ENV === "development"
				? window.location.hostname + ":8080"
				: null
		);

		socket.on("statesync", data => {
			console.log("statesync", data);

			this.setState({ room: data, loading: false });
		});
	}

	render() {
		if (this.state.loading)
			return (
				<div className="App">
					<header className="app-header">
						<ProfileArea />
					</header>

					<div className="content">Joining Room...</div>
				</div>
			);

		return (
			<div className="App">
				<header className="app-header">
					<ProfileArea />
				</header>

				<div className="content">
					<MediaPlayer
						className="player-container"
						url={
							"https://www.youtube.com/watch?v=" +
							this.state.room.queue[this.state.room.cur]
						}
						width={640}
						height={360}
					/>
					<PlaylistView
						items={this.state.room.queue}
						style={{ paddingTop: 16 }}
					/>
				</div>
			</div>
		);
	}

	onSeek() {
		console.log("onSeek");
	}
}

export default App;
