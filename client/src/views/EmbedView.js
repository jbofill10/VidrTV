import React from "react";
import { MediaPlayer } from "../components";
import openSocket from "socket.io-client";

export default class EmbedView extends React.Component {
	constructor() {
		super();

		this.state = {
			room: {},
			joining: true
		};

		// open realtime socket connection
		this.socket = openSocket(
			process.env.NODE_ENV === "development"
				? window.location.hostname + ":8080"
				: null
		);
	}

	componentDidMount() {
		// join room by id
		this.socket.emit("join", { roomid: "5c1c129c8134305cf00f2cfd" });

		// first fullsync = joined room
		this.socket.on("fullsync", data => {
			console.log("fullsync", data);

			this.setState({ room: data, joining: false });
		});
	}

	componentWillUnmount() {
		// disconnect from socket when roomview unmounts
		this.socket.disconnect();
	}

	render() {
		if (this.state.joining) return <div>Joining Room...</div>;
		return (
			<div
				style={{
					position: "absolute",
					overflow: "hidden"
				}}
			>
				<MediaPlayer
					className="player-container"
					width={478}
					height={268}
					socket={this.socket}
					room={this.state.room}
				/>
			</div>
		);
	}
}
