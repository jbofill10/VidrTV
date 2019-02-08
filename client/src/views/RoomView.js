import React from "react";
import { PlaylistView, MediaPlayer } from "../components";
import openSocket from "socket.io-client";

export default class RoomView extends React.Component {
	constructor(props) {
		super();
		this.roomid = props.match.params.id;
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
		this.socket.emit("join", { roomid: this.roomid });

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
			<div>
				<MediaPlayer
					className="player-container"
					width={640}
					height={360}
					socket={this.socket}
					room={this.state.room}
				/>
				<PlaylistView
					items={this.state.room.media}
					style={{ paddingTop: 16 }}
				/>
			</div>
		);
	}
}
