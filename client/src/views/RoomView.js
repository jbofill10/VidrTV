import React from "react";
import { MediaPlayer } from "../components";
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
			<div
				style={{
					display: "flex",
					overflow: "hidden",
					textAlign: "center",
					height: "100%",
					width: "100%"
				}}
			>
				<main
					style={{
						overflowX: "hidden",
						overflowY: "auto",
						flex: 1
					}}
				>
					<MediaPlayer
						className="player-container"
						width={640}
						height={360}
						socket={this.socket}
						room={this.state.room}
					/>
					<div
						style={{
							background: "red",
							height: 40
						}}
					>
						<span>video info</span>
					</div>
				</main>
				<div
					style={{
						background: "blue",
						width: 320
					}}
				>
					sidebar
				</div>
			</div>
		);
	}
}
